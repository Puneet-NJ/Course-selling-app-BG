import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserHome from "./Pages/UserHome";
import UserLayout from "./UserLayout";
import UserCourses from "./Pages/UserCourses";
import UserPurchases from "./Pages/UserPurchases";

function App() {
	return (
		<main>
			<BrowserRouter>
				<UserLayout>
					<Routes>
						<Route path="/" element={<UserHome />} />
						<Route path="/courses" element={<UserCourses />} />
						<Route path="/purchases" element={<UserPurchases />} />
					</Routes>
				</UserLayout>
			</BrowserRouter>
		</main>
	);
}

export default App;
