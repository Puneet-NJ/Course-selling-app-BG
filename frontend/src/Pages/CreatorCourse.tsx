import CreatorCourseComp from "@/Components/CreatorCourseComp";
import CreatorRoutes from "@/Components/HOCs/CreatorRoutes";

const CreatorCourse = () => {
	return (
		<div>
			<CreatorRoutes>
				<CreatorCourseComp />
			</CreatorRoutes>
		</div>
	);
};

export default CreatorCourse;
