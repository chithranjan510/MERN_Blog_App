import { Router } from "express";
import userModel from "../models/user.model.js";

const authorRouter = Router();

authorRouter.get("/", async (req, res) => {
  try {
    const data = await userModel
      .find({ isAdmin: false })
      .select("username email profileImagePath _id");

    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
});

export default authorRouter;
