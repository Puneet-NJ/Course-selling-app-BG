import { purchasedCourseAtom } from "@/utils/atoms";
import { BACKEND_URL } from "@/utils/lib";
import axios from "axios";
import { useCallback, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";

const usePurchasedCourse = () => {
	const params = useParams();
	const courseId = params.courseId;

	const setCourseAtom = useSetRecoilState(purchasedCourseAtom);

	const fetchPurchasedCourse = useCallback(async () => {
		const response = await axios({
			method: "GET",
			url: `${BACKEND_URL}/course/${courseId}`,
			withCredentials: true,
		});
		const course = response.data.course;

		setCourseAtom(course);
	}, []);

	useEffect(() => {
		fetchPurchasedCourse();
	}, [fetchPurchasedCourse]);
};

export default usePurchasedCourse;
