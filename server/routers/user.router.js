import { Router } from "express";
import {
  login,
  register,
  userProfile,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/login", login);

userRouter.post("/register", register);

userRouter.get("/profile", userProfile);

export default userRouter;
