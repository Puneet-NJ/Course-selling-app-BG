import { creatorAtom } from "@/utils/atoms";
import { BACKEND_URL } from "@/utils/lib";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

const useCreatorCourses = () => {
	const { courses, name } = useRecoilValue(creatorAtom);
	const setCreatorData = useSetRecoilState(creatorAtom);

	const fetchCourse = useCallback(async () => {
		const response = await axios({
			method: "GET",
			url: `${BACKEND_URL}/admin/courses`,
			withCredentials: true,
		});

		const { name, courses } = response.data;
		setCreatorData({ name, courses });
	}, [setCreatorData]);

	useEffect(() => {
		if (courses.length === 0 && name === "") {
			fetchCourse();
		}
	}, [fetchCourse, courses, name]);
};

export default useCreatorCourses;
