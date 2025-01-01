import CreatorRoutes from "@/Components/HOCs/CreatorRoutes";
import CreatorHomeComp from "../Components/CreatorHomeComp";

const CreatorHome = () => {
	return (
		<div>
			<CreatorRoutes>
				<CreatorHomeComp />
			</CreatorRoutes>
		</div>
	);
};

export default CreatorHome;
