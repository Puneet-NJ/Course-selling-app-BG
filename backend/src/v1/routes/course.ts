import { Router } from "express";
import { createCourseSchema, updateCourseSchema } from "../types/zod";
import auth from "../middleware/auth";
import client from "../utils/prisma";
import { v4 as uuidv4 } from "uuid";
import { getPresignedUrl, deleteImageFromS3 } from "../utils/aws";

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
		const creatorId = res.locals.Admin.id;

		const creator = await client.course_Creator.findFirst({
			where: { id: creatorId },
		});
		if (!creator) {
			res.status(400).json({ msg: "Invalid creator Id" });
			return;
		}

		const courseThumbnailId = uuidv4();

		const signedUrl = await getPresignedUrl(courseThumbnailId);

		const course = await client.courses.create({
			data: {
				name,
				description,
				price,
				creatorId,
				imageUrl: `${process.env.CDN_LINK}/${courseThumbnailId}`,
				isUploaded: false,
			},
		});

		res.json({
			msg: "Course created successfully",
			signedUrl,
			courseId: course.id,
		});
	} catch (err) {
		console.log(err);

		res.status(500).json({ msg: "Internal server error" });
	}
});

courseRouter.post(
	"/uploadSuccess/:courseId",
	auth(["Admin"]),
	async (req, res) => {
		try {
			const courseId = req.params.courseId;
			const adminId = res.locals.Admin.id;

			try {
				await client.courses.update({
					where: { id: courseId, creatorId: adminId },
					data: { isUploaded: true },
				});
			} catch (err) {
				res.status(400).json({ msg: "You aren't the creator of the course" });
				return;
			}

			res.json({ msg: "Image link updated successfully" });
		} catch (err) {
			res.status(500).json({ msg: "Internal Server Error" });
		}
	}
);

courseRouter.put("/", auth(["Admin"]), async (req, res) => {
	try {
		const validateInput = updateCourseSchema.safeParse(req.body);
		if (!validateInput.success) {
			res.status(411).json({ msg: "Invalid inputs" });
			return;
		}

		const description = validateInput.data.description;
		const price = validateInput.data.price;

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

		const prevImageUrl = isUsersCourse.imageUrl.split(
			process.env.CDN_LINK as string
		);

		const courseThumbnailId = uuidv4();

		const signedUrl = await getPresignedUrl(courseThumbnailId);

		const response = await client.courses.update({
			where: {
				id: courseId,
			},
			data: {
				description,
				price,
				imageUrl: `${process.env.CDN_LINK}/${courseThumbnailId}`,
				isUploaded: false,
			},
		});

		const prevImageKey = prevImageUrl[1].slice(1);
		deleteImageFromS3(prevImageKey);

		res.json({
			msg: "Course info updated successfully",
			courseId: response.id,
			signedUrl,
		});
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

		const prevImageUrl = course.imageUrl.split(process.env.CDN_LINK as string);

		const response = await client.courses.delete({
			where: { id: courseId },
		});

		const prevImageKey = prevImageUrl[1].slice(1);
		deleteImageFromS3(prevImageKey);

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
		console.log(err);

		res.status(500).json({ msg: "Internal server error" });
	}
});
