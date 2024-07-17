import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  editBlog,
  getAllBlogs,
  getBlogById,
} from "../controllers/blog.controller.js";
import { upload } from "../middlewares.js";

const blogRouter = Router();

blogRouter.post("/create", upload.single("blogImage"), createBlog);

blogRouter.get("/", getAllBlogs);

blogRouter.get("/:id", getBlogById);

blogRouter.put("/edit/:id", editBlog);

blogRouter.delete("/delete/:id", deleteBlog);

export default blogRouter;
