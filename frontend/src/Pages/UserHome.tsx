import { useEffect, useRef, useState } from "react";
import {
	ABOUT_CONTENT1,
	ABOUT_CONTENT2,
	ABOUT_CONTENT3,
	ABOUT_CONTENT4,
	BLOCKCHAIN_COHORT_URL,
	COHORT2_URL,
	COHORT3_URL,
	WHY_100XDEVS_URL,
} from "../utils/lib";
import useFetchCourses from "../Hooks/useFetchCourses";
import { useRecoilValue } from "recoil";
import { coursesAtom } from "../utils/atoms";
import { CourseCard } from "../Components/CourseCard";

const UserHome = () => {
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

	return (
		<div className="flex flex-col gap-12">
			<div>
				<div>
					<img src={imageArray.current[currImage]} className="rounded-lg" />
				</div>

				<div className="flex justify-center items-center gap-4 mt-5">
					{imageArray.current.map((image, index) => {
						return (
							<div
								key={image}
								className={
									"rounded-full " +
									(index === currImage
										? "bg-black w-[8px] h-[8px] "
										: "bg-gray-500 w-[6px] h-[6px] ")
								}
							></div>
						);
					})}
				</div>
			</div>

			<div className="flex flex-col gap-10">
				<h3 className="h3 text-3xl font-semibold text-center">Featured</h3>

				<div className="flex justify-between">
					{courses.map((course) => (
						<CourseCard
							key={course.id}
							imageUrl={course.imageUrl}
							title={course.name}
							price={course.price}
							buttonText={"View details"}
						/>
					))}
				</div>
			</div>

			<div>
				<img src={WHY_100XDEVS_URL} />
			</div>

			<div className="flex flex-col gap-5">
				<h3 className="h3 text-3xl font-semibold text-center">
					About 100xDevs
				</h3>

				<p className="flex flex-col gap-5 leading-7 bg-slate-200 px-10 py-4 shadow-lg rounded-lg">
					<div>{ABOUT_CONTENT1}</div>
					<div>{ABOUT_CONTENT2}</div>
					<div>{ABOUT_CONTENT3}</div>
					<div>{ABOUT_CONTENT4}</div>
				</p>
			</div>
		</div>
	);
};

export default UserHome;
