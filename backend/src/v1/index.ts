import { Router } from "express";
import { adminRouter } from "./routes/admin";
import { userRouter } from "./routes/user";
import { courseRouter } from "./routes/course";

export const router = Router();

router.use("/admin", adminRouter);
router.use("/user", userRouter);
router.use("/course", courseRouter);
