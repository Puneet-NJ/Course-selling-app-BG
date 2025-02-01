import {
	ABOUT_CONTENT1,
	ABOUT_CONTENT2,
	ABOUT_CONTENT3,
	ABOUT_CONTENT4,
	WHY_100XDEVS_URL,
} from "../utils/lib";
import useUserHome from "../Hooks/useUserHome";
import { CourseCardDisplay } from "./CourseCardDisplay";
import { CourseCard } from "./CourseCard";

const UserHomeComp = () => {
	const {
		courses,
		currImage,
		imageArray,
		isMobile,
		currCourse,
		isLoading,
		error,
	} = useUserHome();

	if (isLoading) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error loading courses</div>;
	}

	return (
		<div className="flex flex-col gap-12">
			<div>
				<div className="flex justify-center">
					<img
						src={imageArray.current[currImage]}
						className="rounded-lg"
						alt="course banner"
					/>
				</div>

				<div className="flex justify-center items-center gap-4 mt-5">
					{imageArray.current.map((image, index) => (
						<div
							key={image}
							className={
								"rounded-full " +
								(index === currImage
									? "bg-black w-[8px] h-[8px]"
									: "bg-gray-500 w-[6px] h-[6px]")
							}
						/>
					))}
				</div>
			</div>

			<div className="flex flex-col gap-10 mx-auto">
				<h3 className="h3 text-2xl sm:text-3xl font-semibold text-center">
					Featured
				</h3>
				{courses?.length === 0 ? (
					<div className="text-sm font-bold">No courses available</div>
				) : !isMobile ? (
					<CourseCardDisplay courses={courses} />
				) : (
					<CourseCard
						imageUrl={courses?.[currCourse].imageUrl}
						title={courses?.[currCourse].name}
						price={courses?.[currCourse].price}
						buttonText="View details"
						to={`/course/${courses?.[currCourse].id}`}
					/>
				)}
			</div>

			<div className="mx-auto">
				<img src={WHY_100XDEVS_URL} />
			</div>

			<div className="flex flex-col gap-5">
				<h3 className="h3 text-2xl sm:text-3xl font-semibold text-center">
					About 100xDevs
				</h3>

				<div className="flex flex-col gap-5 bg-slate-200 px-10 py-4 shadow-lg rounded-lg text-xs sm:text-base leading-6 sm:leading-7">
					<div>{ABOUT_CONTENT1}</div>
					<div>{ABOUT_CONTENT2}</div>
					<div>{ABOUT_CONTENT3}</div>
					<div>{ABOUT_CONTENT4}</div>
				</div>
			</div>
		</div>
	);
};

export default UserHomeComp;
