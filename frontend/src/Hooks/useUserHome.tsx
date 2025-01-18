import { useEffect, useMemo, useRef, useState } from "react";
import useFetchCourses from "../Hooks/useFetchCourses";
import { useRecoilValue } from "recoil";
import { coursesAtom } from "../utils/atoms";
import { BLOCKCHAIN_COHORT_URL, COHORT2_URL, COHORT3_URL } from "../utils/lib";

const useUserHome = () => {
	const imageArray = useRef([BLOCKCHAIN_COHORT_URL, COHORT2_URL, COHORT3_URL]);
	const [currImage, setCurrImage] = useState(0);
	const [currCourse, setCurrCourse] = useState(0);
	const [screenSize, setScreenSize] = useState(window.innerWidth);

	const { isLoading, error } = useFetchCourses();
	const courses = useRecoilValue(coursesAtom);

	const topCourses = useMemo(() => {
		return courses.slice(0, 3);
	}, [courses]);

	const isMobile = useMemo(() => {
		const mobile = screenSize < 640;
		return mobile;
	}, [screenSize]);

	useEffect(() => {
		if (isLoading || error || topCourses.length === 0) {
			console.log(
				"Skipping interval setup - loading:",
				isLoading,
				"error:",
				error,
				"courses:",
				topCourses.length
			);
			return;
		}

		const imageIntervalId = setInterval(() => {
			setCurrImage((prev) =>
				prev === imageArray.current.length - 1 ? 0 : prev + 1
			);
		}, 3000);

		let courseIntervalId: NodeJS.Timeout | undefined;

		if (isMobile && topCourses.length > 1) {
			courseIntervalId = setInterval(() => {
				setCurrCourse((prev) =>
					prev === topCourses.length - 1 ? 0 : prev + 1
				);
			}, 2000);
		}

		const handleResize = () => {
			const newSize = window.innerWidth;
			setScreenSize(newSize);
		};

		window.addEventListener("resize", handleResize);

		return () => {
			clearInterval(imageIntervalId);
			if (courseIntervalId) {
				clearInterval(courseIntervalId);
			}
			window.removeEventListener("resize", handleResize);
		};
	}, [isMobile, topCourses.length, isLoading, error]);

	return {
		imageArray,
		currImage,
		courses: topCourses,
		isMobile,
		currCourse,
		isLoading,
		error,
	};
};

export default useUserHome;
