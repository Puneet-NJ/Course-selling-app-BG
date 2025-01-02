import { z } from "zod";

export const signupSchema = z.object({
	name: z.string(),
	email: z.string(),
	password: z.string(),
});

export const signinSchema = z.object({
	email: z.string(),
	password: z.string(),
});

export const createCourseSchema = z.object({
	name: z.string(),
	description: z.string(),
	price: z.number(),
});

export const updateCourseSchema = z.object({
	courseId: z.string(),
	description: z.string(),
	price: z.number(),
	imageUrl: z.string(),
});
