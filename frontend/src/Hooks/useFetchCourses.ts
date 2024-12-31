import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { BACKEND_URL } from "../utils/lib";
import { useSetRecoilState } from "recoil";
import { coursesAtom } from "../utils/atoms";
import { useLocation } from "react-router-dom";

const useFetchCourses = () => {
	const setCoursesAtom = useSetRecoilState(coursesAtom);
	const location = useLocation();

	const requestWhere =
		location.pathname === "/creator/courses" ? "admin/courses" : "course";

	const mutation = useMutation({
		mutationFn: () =>
			axios({
				method: "GET",
				url: `${BACKEND_URL}/course/`,
				withCredentials: true,
			}),
		onSuccess: (response) => {
			setCoursesAtom(response.data.courses);
		},
	});

	useEffect(() => {
		mutation.mutate();
	}, []);
};

export default useFetchCourses;
