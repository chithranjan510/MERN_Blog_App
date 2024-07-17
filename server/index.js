import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import userRouter from "./routers/user.router.js";
import { authorizeMiddleware } from "./middlewares.js";
dotenv.config();
const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

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

app.post("/api/imageUpload", upload.single("blogImage"), async (req, res) => {
  const filePath = req.file.path;
  res
    .status(200)
    .json({ imgSrc: `http://localhost:5000/${filePath.replace(/\\/g, "/")}` });
});

// app.post("/api/upload", upload.single("blogImage"), async (req, res) => {
//   console.log(req.body);
//   console.log(req.file.path);
//   res.status(200).send("ok");
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

mongoose.connect(process.env.BACKEND_DATABASE_URL).then(() => {
  console.log("Connected to database");
  app.listen(PORT, () => console.log("Listening to port: " + PORT));
});
