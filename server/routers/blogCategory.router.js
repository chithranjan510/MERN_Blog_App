import { Router } from "express";
import { addCategory, deleteCategory, getCategory } from "../controllers/blogCategory.controller.js";
import { authorizeMiddleware } from "../middlewares.js";

const blogCategoryRouter = Router();

blogCategoryRouter.get("/", getCategory);

blogCategoryRouter.post("/", authorizeMiddleware, addCategory);

blogCategoryRouter.delete("/:id", authorizeMiddleware, deleteCategory);

export default blogCategoryRouter;