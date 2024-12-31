import { Link } from "react-router-dom";
import Logo from "../../utils/Logo";
import { Profile } from "../../utils/Icons";

const CreatorLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div>
			<nav className="flex justify-between items-center px-[5%] py-2 shadow-lg sticky top-0 bg-white z-20">
				<Link to={"/creator/"} className="w-12">
					<Logo />
				</Link>

				<div>
					<div className="flex items-center gap-6">
						<div className="w-10">
							<Profile />
						</div>
					</div>
				</div>
			</nav>

			<div className="pt-10">{children}</div>
		</div>
	);
};

export default CreatorLayout;
