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
