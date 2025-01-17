import { CourseCard } from "@/Components/CourseCard";
import CreatorRoutes from "@/Components/HOCs/CreatorRoutes";
import { Button } from "@/Components/ui/button";
import useCreatorCourses from "@/Hooks/useCreatorCourses";
import { creatorAtom } from "@/utils/atoms";
import { ArrowLeftCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

const CreatorCourses = () => {
	const navigate = useNavigate();
	useCreatorCourses();
	const { courses, name } = useRecoilValue(creatorAtom);

	return (
		<CreatorRoutes>
			<div className="px-10 max-w-6xl mx-auto flex flex-col gap-7 py-10 \">
				<div>
					<Button
						className="bg-gray-800 text-white rounded-full mb-10"
						onClick={() => {
							navigate(-1);
						}}
					>
						<ArrowLeftCircleIcon /> Go Back
					</Button>

					<h2 className="h3 text-3xl font-semibold text-center">
						{name}'s Courses
					</h2>
				</div>

				<span className="text-sm text-gray-500 text-right">
					({courses.length} {courses.length === 1 ? "course" : "courses"})
				</span>

				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto gap-10 justify-between">
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
