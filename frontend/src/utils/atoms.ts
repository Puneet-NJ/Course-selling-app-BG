import { atom } from "recoil";
import { Course, CourseContent, Folder, PurchasedCourse } from "./types";

export const coursesAtom = atom<Course[]>({
	key: "coursesAtom",
	default: [],
});

export const purchasesAtom = atom<Course[]>({
	key: "purchasesAtom",
	default: [],
});

export const courseAtom = atom<Course>({
	key: "courseAtom",
	default: { id: "", name: "", description: "", imageUrl: "", price: 0 },
});

export const purchasedCourseAtom = atom<PurchasedCourse>({
	key: "purchasedCourseAtom",
	default: {
		courseFolders: [],
		creatorId: "",
		description: "",
		id: "",
		imageUrl: "",
		name: "",
		isUploaded: false,
		price: 0,
	},
});

export const contentAtom = atom<CourseContent>({
	key: "contentAtom",
	default: {
		name: "",
		id: "",
		isUploaded: false,
		courseFolderId: "",
	},
});

export const folderAtom = atom<Folder>({
	key: "folderAtom",
	default: {
		courseId: "",
		name: "",
		id: "",
	},
});

export const creatorAtom = atom<{ name: string; courses: Course[] }>({
	key: "creatorAtom",
	default: {
		name: "",
		courses: [],
	},
});

export const userTokenPresentAtom = atom({
	key: "userTokenPresentAtom",
	default: false,
});
