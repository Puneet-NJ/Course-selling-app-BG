import client from "../utils/prisma";

export const isCourseCreator = async (courseId: string, creatorId: string) => {
	try {
		const course = await client.courses.findFirst({
			where: {
				id: courseId,
			},
		});

		if (!course) {
			return {
				status: 411,
				msg: "Invalid Course Id",
			};
		}

		if (course.creatorId !== creatorId) {
			return {
				status: 400,
				msg: "You are not the creator of the course",
			};
		}

		return { status: 200, msg: "Valid", course };
	} catch (err) {
		return { status: 500, msg: "Error while making db call" };
	}
};
