import useCourseComp from "../Hooks/useCourseComp";
import CourseContentCard from "./CourseContentCard";

const CourseComp = () => {
	const { course, handleCoursePurchase } = useCourseComp();

	return (
		<div className="w-full h-[80%]">
			<div className="bg-blue-600 text-white text-4xl font-bold leading-relaxed py-5 px-10">
				<h1 className="w-1/2">{course.name}</h1>
			</div>

			<div className="absolute left-[68%] bottom-[47%]">
				<CourseContentCard
					imageUrl={course.imageUrl}
					price={course.price}
					onPurchase={handleCoursePurchase}
				/>
			</div>

			<div className="my-10 px-10 flex flex-col gap-5 w-1/2">
				<div className="py-3 border-b">
					<span className="px-3 py-3 font-bold border-b-4 border-blue-600">
						Overview
					</span>
				</div>

				<p className="leading-7 text-sm">{course.description}</p>
			</div>
		</div>
	);
};

export default CourseComp;
