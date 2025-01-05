import { Router } from "express";
import { signinSchema, signupSchema } from "../types/zod";
import client from "../utils/prisma";
import { compare, hash } from "bcryptjs";
import jwt from "jsonwebtoken";
import auth from "../middleware/auth";

export const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
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

		const alreadyPresent = await client.user.findUnique({
			where: {
				email,
			},
		});
		if (alreadyPresent) {
			res.status(409).json({ msg: "User already exists" });
			return;
		}

		const user = await client.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});

		const token = jwt.sign(
			{ id: user.id, email: user.email, name: user.name },
			process.env.USER_JWT_PASSWORD as string
		);

		res.cookie("auth", token, {
			httpOnly: true,
			sameSite: "none",
			secure: process.env.NODE_ENV === "production",
			domain: "course-app.puneetnj.fun",
		});

		res.json({ msg: "Sign up successful" });
	} catch (err) {
		res.status(500).json({ msg: "Internal server error" });
	}
});

userRouter.post("/signin", async (req, res) => {
	try {
		const validateInput = signinSchema.safeParse(req.body);
		if (!validateInput.success) {
			res.status(411).json({ msg: "Invalid inputs" });
			return;
		}

		const email = validateInput.data.email;
		const password = validateInput.data.password;

		const user = await client.user.findFirst({
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
			process.env.USER_JWT_PASSWORD as string
		);

		res.cookie("auth", token, {
			httpOnly: true,
			sameSite: "none",
			secure: process.env.NODE_ENV === "production",
			domain: "course-app.puneetnj.fun",
		});

		res.json({ msg: "Sign in successful" });
	} catch (err) {
		res.status(500).json({ msg: "Internal server error" });
	}
});

userRouter.get("/purchases", auth(["User"]), async (req, res) => {
	try {
		const id = res.locals.User.id;

		const allPurchases = await client.purchases.findMany({
			where: { userId: id },
		});
		console.log(allPurchases);

		const courseIds = allPurchases.map((purchased) => purchased.courseId);

		const purchases = await client.courses.findMany({
			where: { id: { in: courseIds } },
		});
		console.log(purchases);

		res.json({ purchases: purchases });
	} catch (err) {
		res.status(500).json({ msg: "Internal server error" });
	}
});

userRouter.post("/purchase/:courseId", auth(["User"]), async (req, res) => {
	try {
		const courseId = req.params.courseId;
		const id = res.locals.User.id;

		const course = await client.courses.findFirst({ where: { id: courseId } });
		if (!course) {
			res.status(400).json({ msg: "Invalid course Id" });
			return;
		}

		const purchase = await client.purchases.create({
			data: {
				courseId: courseId,
				userId: id,
			},
		});

		res.json({ msg: "Course bought" });
	} catch (err) {
		res.status(500).json({ msg: "Internal server error" });
	}
});
