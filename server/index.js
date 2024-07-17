import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/user.router.js";
import { authorizeMiddleware } from "./middlewares.js";
import blogRouter from "./routers/blog.router.js";
import imageRouter from "./routers/image.router.js";
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
app.use("/uploads", express.static(path.join(import.meta.dirname, "uploads")));

const PORT = process.env.PORT;

app.use("/api/auth", userRouter);

app.use("/api/blog", blogRouter);

app.use("/api/image", imageRouter)

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose.connect(process.env.BACKEND_DATABASE_URL).then(() => {
  console.log("Connected to database");
  app.listen(PORT, () => console.log("Listening to port: " + PORT));
});
