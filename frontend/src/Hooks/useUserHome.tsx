import { useEffect, useRef, useState } from "react";
import useFetchCourses from "../Hooks/useFetchCourses";
import { useRecoilValue } from "recoil";
import { coursesAtom } from "../utils/atoms";
import { BLOCKCHAIN_COHORT_URL, COHORT2_URL, COHORT3_URL } from "../utils/lib";

const useUserHome = () => {
	const imageArray = useRef([BLOCKCHAIN_COHORT_URL, COHORT2_URL, COHORT3_URL]);
	const [currImage, setCurrImage] = useState(0);
	const courses = useRecoilValue(coursesAtom);

	useFetchCourses();

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrImage((prev) => {
				if (prev === imageArray.current.length - 1) return 0;
				return prev + 1;
			});
		}, 3000);

		return () => {
			clearInterval(intervalId);
		};
	}, []);

	return { imageArray, currImage, courses: courses.slice(0, 3) };
};

export default useUserHome;
