import { Router } from "express";
import { authorizeMiddleware } from "../middlewares.js";
import userModel from "../models/user.model.js";

const authorRouter = Router();

authorRouter.get("/", authorizeMiddleware, async (req, res) => {
  try {
    const data = await userModel.find().select("username email profileImagePath -_id");

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json(error);
  }
});

export default authorRouter;
