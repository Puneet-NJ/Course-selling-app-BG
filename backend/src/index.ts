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
		origin: "http://localhost:5174",
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

dotenv.config();

app.get("/", (req, res) => {
	res.json({ msg: "Server healthy" });
});

app.use("/api/v1", router);

app.listen(4000);
