import path from "path";
import BlogModel from "../models/blog.model.js";
import fs from "fs";

export const createBlog = async (req, res) => {
  try {
    const { title, description, content, userId, username } = req.body;
    const coverImagePath = req.file.path;
    const payload = {
      userId,
      username,
      title,
      description,
      content,
      coverImagePath,
    };

    if (!title || !description || !content || !coverImagePath) {
      return res.status(400).json({ message: "Please fill all the fields" });
    }

    await BlogModel.create(payload);
    res.status(200).json({ message: "Blog created successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const editBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, content, coverImagePath } = req.body;
    const payload = {
      title,
      description,
      content,
    };
    if (req.file) {
      payload.coverImagePath = req.file.path;

      const filePath = path.join(import.meta.dirname, "..", coverImagePath);
      fs.unlink(filePath, (err) => {
        if (err) {
          if (err.code === "ENOENT") {
            res.status(404).json({ message: "Image file not found" });
          } else {
            res
              .status(500)
              .json({ message: "Error deleting file", error: err });
          }
        }
      });
    } else {
      payload.coverImagePath = coverImagePath;
    }

    const data = await BlogModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });
    if (!data) {
      res
        .status(400)
        .json({ message: "Something went wrong, Please try again" });
    }
    res.status(200).json({ message: "Blog updated successfully" });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { coverImagePath } = req.query;
    if (!id || !coverImagePath) {
      return res.status(400).send({ message: "Invalid url" });
    }

    await BlogModel.findByIdAndDelete(id);

    const filePath = path.join(import.meta.dirname, "..", coverImagePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.status(404).json({ message: "Image file not found" });
        } else {
          res.status(500).json({ message: "Error deleting file", error: err });
        }
      } else {
        res.status(200).json({ message: "File deleted successfully" });
      }
    });
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogModel.find().sort({ createdAt: -1 }).limit(50);
    res.status(200).json(blogs);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await BlogModel.findById(id);
    if (!data) {
      return res.status(404).json({ message: "Data not found" });
    }
    res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
};
