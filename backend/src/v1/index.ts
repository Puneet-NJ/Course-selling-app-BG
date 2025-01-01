import { Router } from "express";
import { adminRouter } from "./routes/admin";
import { userRouter } from "./routes/user";
import { courseRouter } from "./routes/course";
import auth from "./middleware/auth";
import tokenPresent from "./middleware/tokenPresent";

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

			res.json({ loggedIn: false });
		} catch (err) {
			res.status(500).json({ msg: "Internal Server Error" });
		}
	}
);

router.post("/logout", async (req, res) => {
	try {
		res.clearCookie("auth");

		res.json({ msg: "Logged out successfully" });
	} catch (err) {
		res.status(500).json({ msg: "Internal Server Error" });
	}
});

router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/course", courseRouter);
