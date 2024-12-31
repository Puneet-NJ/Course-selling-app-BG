import { useLocation } from "react-router-dom";
import CreatorLayout from "./Components/Layouts/CreatorLayout";
import UserLayout from "./Components/Layouts/UserLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation();

	const isCreator =
		location.pathname.slice(1, 1 + 6) === "creator" ? true : false;

	console.log(isCreator);

	return (
		<>
			{isCreator ? (
				<CreatorLayout>{children}</CreatorLayout>
			) : (
				<UserLayout>{children}</UserLayout>
			)}
		</>
	);
};

export default Layout;
