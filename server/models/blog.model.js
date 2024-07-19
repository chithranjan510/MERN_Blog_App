import mongoose, { mongo } from "mongoose";
import userModel from "./user.model.js";

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    coverImagePath: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: userModel },
  },
  {
    timestamps: true,
  }
);

const categorySchema = new mongoose.Schema({
  category: { type: String, required: true },
});

const BlogModel = mongoose.model("blog", blogSchema);

export const CategoryModel = mongoose.model("Category", categorySchema);

export default BlogModel;
