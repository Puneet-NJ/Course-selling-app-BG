import { useRecoilValue } from "recoil";
import useFetchPurchasedCourses from "../Hooks/useFetchPurchasedCourses";
import { CourseCardDisplay } from "./CourseCardDisplay";
import { purchasesAtom } from "../utils/atoms";

const UserPurchasesComp = () => {
	useFetchPurchasedCourses();
	const purchasedCourses = useRecoilValue(purchasesAtom);

	console.log(purchasedCourses);

	return (
		<div className="flex flex-col gap-7">
			<h2 className="h3 text-3xl font-semibold text-center">Purchases</h2>

			<div>
				<CourseCardDisplay courses={purchasedCourses} />
			</div>
		</div>
	);
};

export default UserPurchasesComp;
