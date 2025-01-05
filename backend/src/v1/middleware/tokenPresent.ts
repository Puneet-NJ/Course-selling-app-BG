import { NextFunction, Request, Response } from "express";

const tokenPresent = (req: Request, res: Response, next: NextFunction) => {
	try {
		const token = req.cookies.auth;

		if (!token) {
			res.locals.tokenPresent = false;

			console.log("TOken is absent");

			res.json({ loggedIn: false, msg: "Token is not present" });
			return;
		}

		res.locals.tokenPresent = true;

		next();
		return;
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
};

export default tokenPresent;
