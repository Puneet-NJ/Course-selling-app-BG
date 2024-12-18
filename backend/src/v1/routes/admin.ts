import { Router } from "express";
import { signinSchema, signupSchema } from "../types/zod";
import { compare, hash } from "bcrypt";
import client from "../utils/prisma";
import jwt from "jsonwebtoken";

export const adminRouter = Router();

adminRouter.post("/signup", async (req, res) => {
	try {
		const validateInput = signupSchema.safeParse(req.body);
		if (!validateInput.success) {
			res.status(411).json({ msg: "Invalid inputs" });
			return;
		}

		const name = validateInput.data.name;
		const email = validateInput.data.email;
		const password = validateInput.data.password;

		const hashedPassword = await hash(password, 12);

		const alreadyPresent = await client.course_Creator.findUnique({
			where: {
				email,
			},
		});
		if (alreadyPresent) {
			res.status(409).json({ msg: "User already exists" });
			return;
		}

		const user = await client.course_Creator.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});

		const token = jwt.sign(
			{ id: user.id, email: user.email, name: user.name },
			process.env.ADMIN_JWT_PASSWORD as string
		);

		res.cookie("auth", token, { httpOnly: true });

		res.json({ msg: "Sign up successful" });
	} catch (err) {
		res.status(500).json({ msg: "Internal server error" });
	}
});

adminRouter.post("/signin", async (req, res) => {
	try {
		const validateInput = signinSchema.safeParse(req.body);
		if (!validateInput.success) {
			res.status(411).json({ msg: "Invalid inputs" });
			return;
		}

		const email = validateInput.data.email;
		const password = validateInput.data.password;

		const user = await client.course_Creator.findFirst({
			where: {
				email: email,
			},
		});
		if (!user) {
			res.status(411).json({ msg: "No user found" });
			return;
		}

		const comparePassword = await compare(password, user.password);
		if (!comparePassword) {
			res.status(400).json({ msg: "Incorrect password" });
			return;
		}

		const token = jwt.sign(
			{ id: user.id, name: user.name, email: user.email },
			process.env.ADMIN_JWT_PASSWORD as string
		);

		res.cookie("auth", token, {
			httpOnly: true,
		});

		res.json({ msg: "Sign in successful" });
	} catch (err) {
		res.status(500).json({ msg: "Internal server error" });
	}
});
