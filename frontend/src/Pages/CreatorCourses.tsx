import { CourseCard } from "@/Components/CourseCard";
import CreatorRoutes from "@/Components/HOCs/CreatorRoutes";
import useCreatorCourses from "@/Hooks/useCreatorCourses";
import { creatorAtom } from "@/utils/atoms";
import { useRecoilValue } from "recoil";

const CreatorCourses = () => {
	useCreatorCourses();
	const { courses, name } = useRecoilValue(creatorAtom);

	return (
		<CreatorRoutes>
			<div className="max-w-6xl mx-auto flex flex-col gap-7 py-10">
				<h2 className="h3 text-3xl font-semibold text-center">
					{name}'s Courses
				</h2>

				<span className="text-sm text-gray-500 text-right">
					({courses.length} {courses.length === 1 ? "course" : "courses"})
				</span>

				<div className="flex flex-wrap gap-10 justify-between">
					{courses.map((course) => (
						<CourseCard
							key={course.id}
							imageUrl={course.imageUrl}
							price={course.price}
							title={course.name}
							buttonText="Edit Course"
							to={`/creator/course/${course.id}`}
						/>
					))}
				</div>
			</div>
		</CreatorRoutes>
	);
};

export default CreatorCourses;
