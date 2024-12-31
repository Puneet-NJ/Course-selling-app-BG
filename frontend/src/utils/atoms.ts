import { atom } from "recoil";
import { Course } from "./types";

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

export const creatorAtom = atom<{ name: string; courses: Course[] }>({
	key: "creatorAtom",
	default: {
		name: "",
		courses: [],
	},
});
