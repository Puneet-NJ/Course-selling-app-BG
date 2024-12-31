import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

type Roles = "Admin" | "User";
type Custom_JWT = JwtPayload & {
	id: string;
	name: string;
	email: string;
};

const auth = (roles: Roles[]) => {
	return (req: Request, res: Response, next: NextFunction) => {
		const token = req.cookies.auth;

		if (!token) {
			res.status(401).json({ msg: "Token is missing" });
			return;
		}

		for (const role of roles) {
			let jwtPass =
				role === "User"
					? process.env.USER_JWT_PASSWORD
					: process.env.ADMIN_JWT_PASSWORD;

			try {
				const tokenVals = jwt.verify(token, jwtPass as string) as Custom_JWT;

				res.locals[role] = {
					id: tokenVals.id,
					name: tokenVals.name,
					email: tokenVals.email,
				};
				return next();
			} catch (err) {}
		}

		res.status(400).json({ msg: "Unauthorized" });
	};
};

export default auth;
