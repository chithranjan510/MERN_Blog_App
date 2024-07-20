import CategoryModel from "../models/blogCategory.model.js";


export const getCategory = async (req, res) => {
  try {
    const data = await CategoryModel.find();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const addCategory = async (req, res) => {
  try {
    const { category } = req.body;
    if (!category) {
      return res.status(400).json({ message: "please send category" });
    }
    await CategoryModel.create({ category });
    res.status(200).json({ message: "Category added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "please send category id" });
    }
    await CategoryModel.findByIdAndDelete(id);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
