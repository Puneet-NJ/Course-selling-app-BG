import Logo from "./utils/Logo";
import {
	Profile,
	Home,
	Courses,
	Purchases,
	Settings,
	Logout,
	Twitter,
	Instagram,
	Youtube,
	Login,
} from "./utils/Icons";
import { useNavigate } from "react-router-dom";
import { PLAYSTORE_URL } from "./utils/lib";
import { useState } from "react";

export const SIDEBAR_OPTIONS = [
	{ name: "Home", to: "/", icon: <Home /> },
	{ name: "Courses", to: "/courses", icon: <Courses /> },
	{ name: "Purchases", to: "/purchases", icon: <Purchases /> },
	{ name: "Settings", to: "/", icon: <Settings /> },
	{ name: "Logout", to: "/signin", icon: <Logout /> },
	{ name: "Login", to: "/signin", icon: <Login /> },
];

const UserLayout = ({ children }: { children: React.ReactNode }) => {
	const navigate = useNavigate();
	const [isCookiePresent, setIsCookiePresent] = useState(false);
	let cookies = document.cookie.split(";");

	let isFound = false;
	for (let i = 0; i < cookies.length; i++) {
		const cookieName = cookies[i].trim().split("=")[0];
		const cookie = cookies[i].trim().split("=")[1];

		console.log(cookie, cookieName, cookies.length);

		if (cookieName === "auth") isFound = true;
	}

	if (isFound) setIsCookiePresent(true);
	else if (isCookiePresent) setIsCookiePresent(false);

	return (
		<div className="w-screen min-h-screen flex flex-col">
			<nav className="flex justify-between items-center px-[5%] py-2 shadow-lg sticky top-0 bg-white z-20">
				<div className="w-12">
					<Logo />
				</div>

				<div>
					<div className="flex items-center gap-6">
						<div>
							{!isFound && (
								<button className="px-5 py-2 bg-slate-300 rounded-lg font-semibold shadow-md hover:bg-slate-500 hover:text-white duration-150">
									Login
								</button>
							)}
						</div>
						<div className="w-10">
							<Profile />
						</div>
					</div>
				</div>
			</nav>

			<div className="flex flex-1">
				<aside className="bg-slate-200 w-1/5 px-20 py-[2%] text-sm sticky top-16 h-[calc(100vh-40px)] shadow-lg">
					<h4 className="font-semibold text-gray-600">MAIN MENU</h4>
					<ul className="mt-[30%] space-y-9">
						{SIDEBAR_OPTIONS.map((option) => {
							if (isFound && option.name === "Login") return;
							if (!isFound && option.name === "Logout") return;

							return (
								<li
									className="flex items-center space-x-3 cursor-pointer"
									key={option.name}
									onClick={() => {
										navigate(option.to);
									}}
								>
									<span>{option.icon}</span>
									<span>{option.name}</span>
								</li>
							);
						})}
					</ul>
				</aside>

				<div className="flex-1 flex flex-col px-[7%]">
					<div className="flex-grow py-10">{children}</div>

					<footer className="bg-slate-200 flex justify-between text-sm p-10 rounded-t-lg shadow-xl">
						<div className="w-20">
							<Logo />
						</div>

						<div className="space-y-4">
							<h5 className="font-bold">Quick Links</h5>

							<ul className="space-y-1">
								<li className="text-blue-600 hover:underline cursor-pointer">
									Terms & Conditions
								</li>
								<li className="text-blue-600 hover:underline cursor-pointer">
									Privacy Policy
								</li>
								<li className="text-blue-600 hover:underline cursor-pointer">
									Refunds & Cancellation Policy
								</li>
							</ul>
						</div>

						<div className="space-y-4">
							<div className="space-y-2">
								<h5 className="font-bold">Download App</h5>

								<div className="w-28">
									<img src={PLAYSTORE_URL} />
								</div>
							</div>

							<div className="space-y-2">
								<h5 className="font-bold">Follow us</h5>

								<ul className="flex gap-2 items-center">
									<li>
										<Twitter />
									</li>
									<li>
										<Instagram />
									</li>
									<li>
										<Youtube />
									</li>
								</ul>
							</div>
						</div>
					</footer>
				</div>
			</div>
		</div>
	);
};

export default UserLayout;
