import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    userId: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    coverImagePath: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const BlogModel = mongoose.model("blog", blogSchema);

export default BlogModel;
