export type Course = {
	id: string;
	name: string;
	description: string;
	imageUrl: string;
	price: number;
};

export type UpdateCourse = {
	description: string;
	price: number;
	courseId: string;
};
