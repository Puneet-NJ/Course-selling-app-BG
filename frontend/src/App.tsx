import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserHome from "./Pages/UserHome";
import UserLayout from "./UserLayout";
import UserCourses from "./Pages/UserCourses";
import UserPurchases from "./Pages/UserPurchases";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Course from "./Pages/Course";

function App() {
	return (
		<main>
			<BrowserRouter>
				<UserLayout>
					<Routes>
						<Route path="/" element={<UserHome />} />
						<Route path="/courses" element={<UserCourses />} />
						<Route path="/purchases" element={<UserPurchases />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/signin" element={<Signin />} />
						<Route path="/course/:courseId" element={<Course />} />
					</Routes>
				</UserLayout>
			</BrowserRouter>
		</main>
	);
}

export default App;
