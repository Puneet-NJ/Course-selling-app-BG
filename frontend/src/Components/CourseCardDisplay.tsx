import { Course } from "../utils/types";
import { CourseCard } from "./CourseCard";

export const CourseCardDisplay = ({
	courses,
	buttonText,
	to,
}: {
	courses: Course[];
	buttonText?: string;
	to?: string;
}) => {
	return (
		<div className="flex justify-between flex-wrap gap-10">
			{courses.map((course) => (
				<CourseCard
					key={course.id}
					imageUrl={course.imageUrl}
					title={course.name}
					price={course.price}
					buttonText={buttonText ? buttonText : "View details"}
					to={
						to === "purchasedPage"
							? `/purchased/${course.id}`
							: `/course/${course.id}`
					}
				/>
			))}
		</div>
	);
};
