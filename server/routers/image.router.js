import { Router } from "express";
import { upload } from "../middlewares.js";
import { deleteImage, uploadImage } from "../controllers/image.controller.js";

const imageRouter = Router();

imageRouter.post("/upload", upload.single("image"), uploadImage);

imageRouter.delete("/delete", deleteImage);

export default imageRouter