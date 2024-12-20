import express from "express";
import { router } from "./v1";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

dotenv.config();

app.use("/api/v1", router);

app.listen(4000);
