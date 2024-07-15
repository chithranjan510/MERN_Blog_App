import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/user.router.js";
import { authorizeMiddleware } from "./middlewares.js";
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);
app.use(authorizeMiddleware);

const PORT = process.env.PORT;

app.use("/api/auth", userRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose.connect(process.env.BACKEND_DATABASE_URL).then(() => {
  console.log("Connected to database");
  app.listen(PORT, () => console.log("Listening to port: " + PORT));
});
