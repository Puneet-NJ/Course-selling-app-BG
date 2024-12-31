import { Course } from "../utils/types";
import { CourseCard } from "./CourseCard";

export const CourseCardDisplay = ({ courses }: { courses: Course[] }) => {
	return (
		<div className="flex justify-between flex-wrap gap-10">
			{courses.map((course) => (
				<CourseCard
					key={course.id}
					imageUrl={course.imageUrl}
					title={course.name}
					price={course.price}
					buttonText={"View details"}
					to={`/course/${course.id}`}
				/>
			))}
		</div>
	);
};
