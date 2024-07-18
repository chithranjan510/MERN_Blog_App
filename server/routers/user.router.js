import { Router } from "express";
import {
  deleteProfileImage,
  login,
  register,
  uploadProfileImage,
  userProfile,
} from "../controllers/user.controller.js";
import { authorizeMiddleware, upload } from "../middlewares.js";

const userRouter = Router();

userRouter.post("/login", login);

userRouter.post("/register", register);

userRouter.get("/profile", authorizeMiddleware, userProfile);

userRouter.post(
  "/profileImage/:id",
  [authorizeMiddleware, upload.single("profileImage")],
  uploadProfileImage
);

userRouter.delete("/profileImage/:id", authorizeMiddleware, deleteProfileImage);

export default userRouter;
