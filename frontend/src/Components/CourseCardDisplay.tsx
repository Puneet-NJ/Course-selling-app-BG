import { Course } from "../utils/types";
import { CourseCard } from "./CourseCard";

export const CourseCardDisplay = ({ courses }: { courses: Course[] }) => {
	return (
		<div className="flex justify-between">
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
