import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { BACKEND_URL } from "../utils/lib";
import { useSetRecoilState } from "recoil";
import { coursesAtom } from "../utils/atoms";

const useFetchCourses = async () => {
	const setCoursesAtom = useSetRecoilState(coursesAtom);

	const mutation = useMutation({
		mutationFn: () => axios({ method: "GET", url: `${BACKEND_URL}/course/` }),
		onSuccess: (response) => {
			setCoursesAtom(response.data.courses);
		},
	});

	useEffect(() => {
		mutation.mutate();
	}, []);
};

export default useFetchCourses;
