import { useRecoilValue } from "recoil";
import { CourseCardDisplay } from "../Components/CourseCardDisplay";
import useFetchCourses from "../Hooks/useFetchCourses";
import { coursesAtom } from "../utils/atoms";

const UserCourses = () => {
	useFetchCourses();
	const courses = useRecoilValue(coursesAtom);

	return (
		<div className="flex flex-col gap-7">
			<h2 className="h3 text-3xl font-semibold text-center">Courses</h2>

			<div className="">
				<CourseCardDisplay courses={courses} />
			</div>
		</div>
	);
};

export default UserCourses;
