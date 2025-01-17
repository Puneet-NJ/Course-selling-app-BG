import { Router } from "express";
import {
	createContentSchema,
	createCourseSchema,
	createFolderSchema,
	updateCourseSchema,
} from "../types/zod";
import auth from "../middleware/auth";
import client from "../utils/prisma";
import { v4 as uuidv4 } from "uuid";
import {
	getPresignedUrl,
	deleteS3,
	getPresignedUrlTemp,
	presignedUrlVideo,
} from "../utils/aws";
import { isCourseCreator } from "../utils/lib";
import { ContentStatus } from "@prisma/client";

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

		const courseId = uuidv4();

		const courseThumbnailId = `${courseId}/thumbnail`;

		const signedUrl = await getPresignedUrl(courseThumbnailId, "image/png");

		const course = await client.courses.create({
			data: {
				id: courseId,
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

			const course = await client.courses.update({
				where: { id: courseId, creatorId: adminId },
				data: { isUploaded: true },
			});
			if (!course) {
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

		const courseThumbnailId = `${courseId}/thumbnail`;

		const signedUrl = await getPresignedUrl(courseThumbnailId, "image/png");

		const response = await client.courses.update({
			where: {
				id: courseId,
			},
			data: {
				description,
				price,
				isUploaded: false,
			},
		});

		res.json({
			msg: "Course info updated successfully",
			courseId: response.id,
			signedUrl,
		});
	} catch (err) {
		res.status(500).json({ msg: "Internal server error" });
	}
});

// Todo: Delete the videos from s3 aswell ✅
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

		await deleteS3(courseId);

		res.json({ msg: "Course deleted successfully" });
	} catch (err) {
		console.log(err);

		res.status(500).json({ msg: "Internal server error" });
	}
});

// GETS ALL THE INFO OF A COURSE
courseRouter.get("/:courseId", async (req, res) => {
	try {
		const courseId = req.params.courseId;

		const course = await client.courses.findFirst({
			where: { id: courseId },
			include: { courseFolders: { include: { courseContents: true } } },
		});

		if (!course) {
			res.status(400).json({ msg: "Invalid course" });
			return;
		}

		res.json({ course });
	} catch (err) {
		console.log(err);

		res.status(500).json({ msg: "Internal server error" });
	}
});

// GETS ALL THE CONTENT INFO ALONG WITH SIGNED URL
courseRouter.get("/:courseId/:contentId", auth(["User"]), async (req, res) => {
	try {
		const { courseId, contentId } = req.params;
		const userId = res.locals.User.id;

		const purchased = await client.purchases.findFirst({
			where: {
				userId,
				courseId,
			},
		});

		if (!purchased) {
			res.status(400).json({ msg: "You have not bought this course" });
			return;
		}

		const content = await client.courseContent.findFirst({
			where: { id: contentId },
		});

		if (!content) {
			res.status(400).json({ msg: "Invalid content Id" });
			return;
		}

		const objectKey = `${courseId}/${content.courseFolderId}/${contentId}/master.m3u8`;

		const signedUrl = presignedUrlVideo(objectKey);

		const folder = await client.courseFolder.findFirst({
			where: { id: content.courseFolderId },
		});

		res.json({ content, folder, signedUrl });
	} catch (err) {
		console.log(err);

		res.status(500).json({ msg: "Internal Server Error" });
	}
});

// GETS ALL THE COURSES
courseRouter.get("/", async (req, res) => {
	try {
		const courses = await client.courses.findMany({});

		res.json({ courses });
	} catch (err) {
		console.log(err);

		res.status(500).json({ msg: "Internal server error" });
	}
});

courseRouter.post("/createFolder", auth(["Admin"]), async (req, res) => {
	try {
		const validateInput = createFolderSchema.safeParse(req.body);
		if (!validateInput.success) {
			res.status(411).json({ msg: "Invalid inputs" });
			return;
		}

		const { courseId, name: folderName } = validateInput.data;
		const creatorId = res.locals.Admin.id;

		//  check if the course is present
		const isCreator = await isCourseCreator(courseId, creatorId);
		if (isCreator.status !== 200) {
			res.status(isCreator.status).json({ msg: isCreator.msg });
			return;
		}

		// Course folder present
		const folderPresent = await client.courseFolder.findFirst({
			where: {
				courseId,
				name: folderName,
			},
		});
		if (folderPresent) {
			res.status(400).json({ msg: "Folder with similar name already exists" });
			return;
		}

		const folder = await client.courseFolder.create({
			data: {
				name: folderName,
				courseId: courseId,
			},
		});

		res.json({ msg: "Folder created successfully" });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
});

courseRouter.post("/postContent", auth(["Admin"]), async (req, res) => {
	try {
		const validateInput = createContentSchema.safeParse(req.body);
		if (!validateInput.success) {
			res.status(411).json({ msg: "Invalid inputs" });
			return;
		}

		const creatorId = res.locals.Admin.id;
		const { folderId, name: contentName } = validateInput.data;

		const folder = await client.courseFolder.findFirst({
			where: {
				id: folderId,
			},
		});
		if (!folder) {
			res.status(411).json({ msg: "Invalid folder ID" });
			return;
		}

		const isCreator = await isCourseCreator(folder.courseId, creatorId);
		if (isCreator.status !== 200) {
			res.status(isCreator.status).json({ msg: isCreator.msg });
			return;
		}

		// Create signed url
		// Create a db entry
		const courseId = folder.courseId;
		const contentId = uuidv4();

		const objectKey = `${courseId}/${folderId}/${contentId}`;

		const signedUrl = await getPresignedUrlTemp(objectKey, "video/mp4");

		const content = await client.courseContent.create({
			data: {
				id: contentId,
				name: contentName,
				courseFolderId: folderId,
				status: ContentStatus.PROCESSING,
			},
		});

		res.json({ signedUrl });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
});

// Todo: add some token auth
courseRouter.put(
	"/contentUploaded/:contentId",

	async (req, res) => {
		try {
			// const creatorId = res.locals.Admin.id;
			const contentId = req.params.contentId;

			// need to check if the creator who is trying to update the courseContent is the actual creator of the course or not
			const course = await client.courseContent.findFirst({
				where: { id: contentId },
				include: {
					courseFolder: { include: { course: true } },
				},
			});

			// if (course?.courseFolder.course.creatorId !== creatorId) {
			// 	res.status(400).json({ msg: "You are not the creator of the course" });
			// 	return;
			// }

			const content = await client.courseContent.update({
				where: {
					id: contentId,
				},
				data: {
					status: ContentStatus.PROCESSED,
				},
			});

			res.json({ msg: "Course updated successfully" });
		} catch (err) {
			console.log(err);

			res.status(500).json({ msg: "Internal Server Error" });
		}
	}
);

// * Delete Endpoints

// Delete a video
courseRouter.delete(
	"/content/:contentId",
	auth(["Admin"]),
	async (req, res) => {
		try {
			const userId = res.locals.Admin.id;
			const { contentId } = req.params;

			const content = await client.courseContent.findFirst({
				where: {
					id: contentId,
				},
				include: {
					courseFolder: {
						include: {
							course: true,
						},
					},
				},
			});

			if (!content) {
				res.status(400).json({ msg: "Invalid Content Id" });
				return;
			}

			const actualCreator = content.courseFolder.course.creatorId;
			const contentKey = `${content.courseFolder.course.id}/${content?.courseFolderId}/${content?.id}`;

			if (actualCreator !== userId) {
				res.json({ msg: "You are not the creator of the course" });
				return;
			}

			const response = await client.courseContent.delete({
				where: { id: contentId },
			});

			await deleteS3(contentKey);

			res.json({ msg: "Course Deleted Successfully" });
		} catch (err) {
			res.status(500).json({ msg: "Internal Server Error" });
		}
	}
);

// Delete a Folder
courseRouter.delete("/folder/:folderId", auth(["Admin"]), async (req, res) => {
	try {
		const userId = res.locals.Admin.id;
		const { folderId } = req.params;

		const folder = await client.courseFolder.findFirst({
			where: {
				id: folderId,
			},
			include: { course: true },
		});

		if (!folder) {
			res.status(400).json({ msg: "Invalid Folder Id" });
			return;
		}

		const actualCreator = folder.course.creatorId;
		const folderKey = `${folder.course.id}/${folder.id}`;

		if (actualCreator !== userId) {
			res.status(400).json({ msg: "Invalid Content Id" });
			return;
		}

		const response = await client.courseFolder.delete({
			where: {
				id: folderId,
			},
		});

		await deleteS3(folderKey);

		res.json({ msg: "Folder deleted successfully" });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
});
