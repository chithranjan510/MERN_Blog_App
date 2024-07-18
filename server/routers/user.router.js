import { Router } from "express";
import {
  login,
  register,
  userProfile,
} from "../controllers/user.controller.js";
import { authorizeMiddleware } from "../middlewares.js";

const userRouter = Router();

userRouter.post("/login", login);

userRouter.post("/register", register);

userRouter.get("/profile", authorizeMiddleware, userProfile);

export default userRouter;
