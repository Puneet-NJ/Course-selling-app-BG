import { Router } from "express";
import { adminRouter } from "./routes/admin";
import { userRouter } from "./routes/user";

export const router = Router();

router.use("/admin", adminRouter);
router.use("/user", userRouter);
