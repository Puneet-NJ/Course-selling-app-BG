import express from "express";
import { router } from "./v1";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

const app = express();
app.use(cookieParser());
app.use(express.json());

dotenv.config();

app.use("/api/v1", router);

app.listen(4000);
