import { BACKEND_URL } from "@/utils/lib";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CreatorRoutes = ({ children }: { children: React.ReactNode }) => {
	const [isCreator, setIsCreator] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		axios({
			method: "GET",
			url: `${BACKEND_URL}/isLoggedIn`,
			withCredentials: true,
		})
			.then((response) => {
				if (response.data.loggedIn && response.data.role === "creator") {
					setIsCreator(true);
				} else {
					navigate("/signin");
				}
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	if (!isCreator) {
		return <div>loading...</div>;
	}
	return <div>{children}</div>;
};

export default CreatorRoutes;
