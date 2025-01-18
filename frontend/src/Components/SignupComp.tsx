import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/lib";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const SignupComp = () => {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState("student");
	const navigate = useNavigate();

	const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const userKind = role === "student" ? "user" : "admin";

		try {
			const response = await axios.post(
				`${BACKEND_URL}/${userKind}/signup`,
				{
					name,
					email,
					password,
				},
				{ withCredentials: true }
			);

			if (response.status === 200) {
				navigate(userKind === "user" ? "/" : "/creator");
			}
		} catch (error) {
			console.error("Error signing up:", error);
		}
	};

	return (
		<Card className="w-full max-w-md mx-auto mt-8 shadow-2xl">
			<CardHeader>
				<CardTitle className="text-center text-xl font-bold">Sign Up</CardTitle>
			</CardHeader>
			<CardContent>
				<form className="space-y-6" onSubmit={handleFormSubmit}>
					<div className="space-y-2">
						<label htmlFor="name" className="text-sm font-medium">
							Name
						</label>
						<Input
							id="name"
							placeholder="John Doe"
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="email" className="text-sm font-medium">
							Email
						</label>
						<Input
							id="email"
							placeholder="john@mail.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="password" className="text-sm font-medium">
							Password
						</label>
						<Input
							id="password"
							type="password"
							placeholder="Enter your password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<div className="space-y-2">
						<label htmlFor="role" className="text-sm font-medium">
							Role
						</label>
						<select
							id="role"
							value={role}
							onChange={(e) => setRole(e.target.value)}
							className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-500"
						>
							<option value="student">Student</option>
							<option value="creator">Creator</option>
						</select>
					</div>

					<Button type="submit" className="w-full">
						Sign Up
					</Button>

					<p className="text-center text-sm font-medium">
						Already Signed Up?{" "}
						<Link to="/signin" className="text-indigo-600 hover:underline">
							Sign In
						</Link>
					</p>
				</form>
			</CardContent>
		</Card>
	);
};

export default SignupComp;
