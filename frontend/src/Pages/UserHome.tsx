import { useEffect, useRef, useState } from "react";
import { BLOCKCHAIN_COHORT_URL, COHORT2_URL, COHORT3_URL } from "../utils/lib";
import useFetchCourses from "../Hooks/useFetchCourses";
import { useRecoilValue } from "recoil";
import { coursesAtom } from "../utils/atoms";

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
		<div>
			<div>
				<div>
					<img src={imageArray.current[currImage]} className="rounded-lg" />
				</div>

				<div className="flex justify-center items-center gap-4 mt-5">
					{imageArray.current.map((image, index) => {
						return (
							<div
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

			<div>
				<h3>Featured</h3>

				<div>
					{courses.map((course) => {
						return <div>{JSON.stringify(course)}</div>;
					})}
				</div>
			</div>
		</div>
	);
};

export default UserHome;
