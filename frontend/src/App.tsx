import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserHome from "./Pages/UserHome";
import UserLayout from "./UserLayout";

function App() {
	return (
		<main>
			<BrowserRouter>
				<UserLayout>
					<Routes>
						<Route path="/" element={<UserHome />} />
					</Routes>
				</UserLayout>
			</BrowserRouter>
		</main>
	);
}

export default App;
