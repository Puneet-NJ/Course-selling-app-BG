import { Link, useNavigate } from "react-router-dom";
import Logo from "../../utils/Logo";
import { Profile } from "../../utils/Icons";
import { Button } from "../ui/button";
import axios from "axios";
import { BACKEND_URL } from "@/utils/lib";

const CreatorLayout = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		axios({
			method: "DELETE",
			url: `${BACKEND_URL}/logout`,
			withCredentials: true,
		}).then(() => {
			navigate("/signin");
		});
	};

	return (
		<div>
			<nav className="flex justify-between items-center px-[5%] py-2 shadow-lg sticky top-0 bg-white z-20">
				<Link to={"/creator/"} className="w-12">
					<Logo />
				</Link>

				<div className="flex items-center gap-6">
					<div>
						<Button variant={"destructive"} onClick={handleLogout}>
							Log out
						</Button>
					</div>

					<div className="w-10">
						<Profile />
					</div>
				</div>
			</nav>

			<div className="pt-10">{children}</div>
		</div>
	);
};

export default CreatorLayout;
