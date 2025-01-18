import { Router } from "express";
import { adminRouter } from "./routes/admin";
import { userRouter } from "./routes/user";
import { courseRouter } from "./routes/course";
import auth from "./middleware/auth";
import tokenPresent from "./middleware/tokenPresent";
import jwt from "jsonwebtoken";

export const router = Router();

router.get(
	"/isLoggedIn",
	tokenPresent,
	auth(["Admin", "User"]),
	async (req, res) => {
		try {
			if (res.locals?.User) {
				res.json({ loggedIn: true, role: "user" });
				return;
			} else if (res.locals?.Admin) {
				res.json({ loggedIn: true, role: "creator" });
				return;
			}

			res.json({ loggedIn: false, msg: "Token was present" });
		} catch (err) {
			res.status(500).json({ msg: "Internal Server Error" });
		}
	}
);

router.delete("/logout", async (req, res) => {
	try {
		res.clearCookie("auth");

		res.json({ msg: "Logged out successfully" });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
});

router.post("/guestLogin/:role", async (req, res) => {
	try {
		const { role } = req.params;

		if (role !== "student" && role !== "creator") {
			res.status(400).json({ msg: "Invalid role" });
			return;
		}

		let email = "";
		let id = "";
		let name = "";

		let jwtPass = "";
		if (role === "student") {
			id = "67e6ab7a-9fcf-4fc4-a763-b5ccfc5c0493";
			email = "student@mail.com";
			name = "student";

			jwtPass = process.env.USER_JWT_PASSWORD as string;
		} else {
			id = "75085499-d407-4323-9fd8-5a931947136b";
			email = "teacher@mail.com";
			name = "Teacher";

			jwtPass = process.env.ADMIN_JWT_PASSWORD as string;
		}

		const token = jwt.sign({ id: id, name: name, email: email }, jwtPass);

		res.cookie("auth", token, {
			httpOnly: true,
			sameSite: "none",
			secure: true,
			path: "/",
		});

		res.json({ msg: "Sign in successful" });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
});

router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/course", courseRouter);
