import { useRecoilValue } from "recoil";
import useFetchPurchasedCourses from "../Hooks/useFetchPurchasedCourses";
import { CourseCardDisplay } from "./CourseCardDisplay";
import { purchasesAtom } from "../utils/atoms";

const UserPurchasesComp = () => {
	useFetchPurchasedCourses();
	const purchasedCourses = useRecoilValue(purchasesAtom);

	return (
		<div className="flex flex-col gap-7">
			<h2 className="h3 text-3xl font-semibold text-center">Purchases</h2>

			<div>
				{purchasedCourses.length === 0 ? (
					<div className="text-sm font-bold text-center">
						You haven't purchased any courses
					</div>
				) : (
					<CourseCardDisplay
						courses={purchasedCourses}
						buttonText="View Content"
						to="purchasedPage"
					/>
				)}
			</div>
		</div>
	);
};

export default UserPurchasesComp;
