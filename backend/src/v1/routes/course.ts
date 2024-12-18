import { Router } from "express";
import { createCourseSchema, updateCourseSchema } from "../types/zod";
import auth from "../middleware/auth";
import client from "../utils/prisma";

export const courseRouter = Router();

courseRouter.post("/", auth(["Admin"]), async (req, res) => {
	try {
		const validateInput = createCourseSchema.safeParse(req.body);
		if (!validateInput.success) {
			res.status(411).json({ msg: "Invalid inputs" });
			return;
		}

		const name = validateInput.data.name;
		const description = validateInput.data.description;
		const price = validateInput.data.price;
		const imageUrl = validateInput.data.imageUrl;
		const creatorId = res.locals.Admin.id;

		console.log(creatorId);

		const creator = await client.course_Creator.findFirst({
			where: { id: creatorId },
		});
		if (!creator) {
			res.status(400).json({ msg: "Invalid creator Id" });
			return;
		}

		const course = await client.courses.create({
			data: {
				name,
				description,
				price,
				creatorId,
				imageUrl,
			},
		});

		res.json({ msg: "Course created successfully" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ msg: "Internal server error" });
	}
});

courseRouter.put("/", auth(["Admin"]), async (req, res) => {
	try {
		const validateInput = updateCourseSchema.safeParse(req.body);
		if (!validateInput.success) {
			res.status(411).json({ msg: "Invalid inputs" });
			return;
		}

		const description = validateInput.data.description;
		const price = validateInput.data.price;
		const imageUrl = validateInput.data.imageUrl;

		const courseId = validateInput.data.courseId;
		const id = res.locals.Admin.id;

		const isUsersCourse = await client.courses.findFirst({
			where: { id: courseId },
		});
		if (!isUsersCourse) {
			res.status(400).json({ msg: "Invalid course id" });
			return;
		}

		if (isUsersCourse.creatorId !== id) {
			res.status(400).json({ msg: "You are not the creator of the course" });
			return;
		}

		const response = await client.courses.update({
			where: {
				id: courseId,
			},
			data: {
				description,
				price,
				imageUrl,
			},
		});

		res.json({ msg: "Course info updated successfully", course: response });
	} catch (err) {
		res.status(500).json({ msg: "Internal server error" });
	}
});

courseRouter.delete("/:courseId", auth(["Admin"]), async (req, res) => {
	try {
		const courseId = req.params.courseId;
		const id = res.locals.Admin.id;

		const course = await client.courses.findFirst({
			where: {
				id: courseId,
			},
		});
		if (!course) {
			res.status(400).json({
				msg: "Invalid course id",
			});
			return;
		}

		if (course.creatorId !== id) {
			res.status(400).json({ msg: "This course was not created by you" });
			return;
		}

		const response = await client.courses.delete({
			where: { id: courseId },
		});

		res.json({ msg: "Course deleted successfully" });
	} catch (err) {
		res.status(500).json({ msg: "Internal server error" });
	}
});

courseRouter.get("/:courseId", async (req, res) => {
	try {
		const courseId = req.params.courseId;

		const course = await client.courses.findFirst({
			where: { id: courseId },
		});

		if (!course) {
			res.status(400).json({ msg: "Invalid course" });
			return;
		}

		res.json({ course });
	} catch (err) {
		res.status(500).json({ msg: "Internal server error" });
	}
});

courseRouter.get("/", async (req, res) => {
	try {
		const courses = await client.courses.findMany({});

		res.json({ courses });
	} catch (err) {
		res.status(500).json({ msg: "Internal server error" });
	}
});
