import express from "express";
import path from "path";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routers/user.router.js";
import blogRouter from "./routers/blog.router.js";
import authorRouter from "./routers/author.router.js";
import blogCategoryRouter from "./routers/blogCategory.router.js";
import adminRouter from "./routers/admin.router.js";
dotenv.config();
const app = express();

const PORT = process.env.PORT;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(import.meta.dirname, "uploads")));

app.use("/api/user", userRouter);

app.use("/api/blog", blogRouter);

app.use("/api/blogCategory", blogCategoryRouter);

app.use("/api/authors", authorRouter);

app.use("/api/admin", adminRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose.connect(process.env.BACKEND_DATABASE_URL).then(() => {
  console.log("Connected to database");
  app.listen(PORT, () => console.log("Listening to port: " + PORT));
});
