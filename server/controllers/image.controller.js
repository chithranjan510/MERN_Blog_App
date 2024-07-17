import path from "path";
import fs from "fs";

export const uploadImage = async (req, res) => {
  try {
    res.status(200).json({ coverImagePath: req.file.path });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { coverImagePath } = req.query;
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
    res.status(500).json(error);
  }
};
