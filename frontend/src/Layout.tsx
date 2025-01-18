import { useLocation } from "react-router-dom";
import CreatorLayout from "./Components/Layouts/CreatorLayout";
import UserLayout from "./Components/Layouts/UserLayout";

const Layout = ({ children }: { children: React.ReactNode }) => {
	const location = useLocation();

	const isCreator =
		location.pathname.slice(1, 1 + 7) === "creator" ? true : false;

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
