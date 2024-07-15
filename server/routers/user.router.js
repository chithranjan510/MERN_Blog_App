import { Router } from "express";
import {
  login,
  register,
  verifyUserToken,
} from "../controllers/user.controller.js";

const userRouter = Router();

userRouter.post("/login", login);

userRouter.post("/register", register);

userRouter.get("/verify", verifyUserToken);

export default userRouter;
