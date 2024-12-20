import { useNavigate, useParams } from "react-router-dom";
import useFetchCourse from "../Hooks/useFetchCourse";
import { useRecoilValue } from "recoil";
import { courseAtom } from "../utils/atoms";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { BACKEND_URL } from "../utils/lib";

const useCourseComp = () => {
	const navigate = useNavigate();
	const params = useParams();

	useFetchCourse({ courseId: params.courseId || "" });

	const course = useRecoilValue(courseAtom);

	const purchaseMutation = useMutation({
		mutationFn: () =>
			axios({
				method: "POST",
				url: `${BACKEND_URL}/user/purchase/${course.id}`,
				withCredentials: true,
			}),

		onSuccess: () => {
			navigate("/purchases");
		},
	});

	const handleCoursePurchase = () => {
		purchaseMutation.mutate();
	};

	return { course, handleCoursePurchase };
};

export default useCourseComp;
