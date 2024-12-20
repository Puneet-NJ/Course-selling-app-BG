import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";
import { BACKEND_URL } from "../utils/lib";
import { useSetRecoilState } from "recoil";
import { courseAtom } from "../utils/atoms";

const useFetchCourse = ({ courseId }: { courseId: string }) => {
	const setCourseAtom = useSetRecoilState(courseAtom);

	const mutation = useMutation({
		mutationFn: () =>
			axios({ method: "GET", url: `${BACKEND_URL}/course/${courseId}` }),
		onSuccess: (response) => {
			setCourseAtom(response.data.course);
		},
	});

	useEffect(() => {
		mutation.mutate();
	}, [courseId]);
};

export default useFetchCourse;
