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

export type CourseContent = {
	name: string;
	id: string;
	isUploaded: boolean;
	courseFolderId: string;
};

type CourseFolder = {
	courseContents: CourseContent[];
	name: string;
	id: string;
	courseId: string;
};

export type PurchasedCourse = {
	courseFolders: CourseFolder[];
	creatorId: string;
	description: string;
	id: string;
	imageUrl: string;
	name: string;
	isUploaded: boolean;
	price: number;
};

export type Folder = {
	courseId: string;
	name: string;
	id: string;
};
