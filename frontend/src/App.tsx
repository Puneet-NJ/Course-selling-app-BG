import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserHome from "./Pages/UserHome";
import UserCourses from "./Pages/UserCourses";
import UserPurchases from "./Pages/UserPurchases";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import Course from "./Pages/Course";
import Layout from "./Layout";
import CreatorHome from "./Pages/CreatorHome";
import CreatorCourse from "./Pages/CreatorCourse";
import CreatorCourses from "./Pages/CreatorCourses";

function App() {
	return (
		<main>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route path="/" element={<UserHome />} />
						<Route path="/courses" element={<UserCourses />} />
						<Route path="/purchases" element={<UserPurchases />} />
						<Route path="/signup" element={<Signup />} />
						<Route path="/signin" element={<Signin />} />
						<Route path="/course/:courseId" element={<Course />} />

						<Route path="/creator" element={<CreatorHome />} />
						<Route path="/creator/courses" element={<CreatorCourses />} />
						<Route
							path="/creator/course/:courseId"
							element={<CreatorCourse />}
						/>
					</Routes>
				</Layout>
			</BrowserRouter>
		</main>
	);
}

export default App;
