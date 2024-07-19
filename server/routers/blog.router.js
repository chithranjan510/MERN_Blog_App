import { Router } from "express";
import {
  addCategory,
  createBlog,
  deleteBlog,
  deleteCategory,
  editBlog,
  getAllBlogs,
  getBlogById,
} from "../controllers/blog.controller.js";
import { authorizeMiddleware, upload } from "../middlewares.js";

const blogRouter = Router();

blogRouter.post(
  "/create",
  [authorizeMiddleware, upload.single("blogImage")],
  createBlog
);

blogRouter.get("/", getAllBlogs);

blogRouter.get("/:id", getBlogById);

blogRouter.put(
  "/edit/:id",
  [authorizeMiddleware, upload.single("blogImage")],
  editBlog
);

blogRouter.delete("/delete/:id", authorizeMiddleware, deleteBlog);

blogRouter.post("/category", authorizeMiddleware, addCategory);

blogRouter.delete("/category/:id", authorizeMiddleware, deleteCategory);

export default blogRouter;
