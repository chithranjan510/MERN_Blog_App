import bcrypt from "bcrypt";
import jsonWebToken from "jsonwebtoken";
import userModel from "../models/user.model.js";
import path from "path";
import fs from "fs";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User email does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Password is incorrect" });
    }

    jsonWebToken.sign(
      { id: user._id },
      process.env.JWT_SECRET_KEY,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .status(200)
          .cookie("token", token, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: true,
            sameSite: "None",
          })
          .json({ message: "Successful" });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: "username, email and password, all are required" });
    }
    const duplicateEmail = await userModel.findOne({ email });

    if (duplicateEmail) {
      return res.status(400).json({ message: "Email already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await userModel.create({
      ...req.body,
      isAdmin: false,
      password: hashedPassword,
    });
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    await userModel.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const userProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    const data = jsonWebToken.verify(token, process.env.JWT_SECRET_KEY);
    const userData = await userModel.findById(data.id);

    if (!userData) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).json({
        username: userData.username,
        email: userData.email,
        id: userData._id,
        isAdmin: userData.isAdmin,
        profileImagePath: userData.profileImagePath,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const newData = req.body;
    const { token } = req.cookies;

    const { id } = jsonWebToken.verify(token, process.env.JWT_SECRET_KEY);

    const userData = await userModel.findById(id);

    if (!userData) {
      res.status(404).json({ message: "User not found" });
    }

    const hashedPassword = newData.password
      ? await bcrypt.hash(newData.password, 10)
      : null;

    if (hashedPassword) {
      newData.password = hashedPassword;
    }

    const { username, email, password } = userData;

    const payload = { username, email, password, ...newData };

    await userModel.findByIdAndUpdate(id, payload, {
      new: true,
      runValidators: true,
    });

    jsonWebToken.sign({ id }, process.env.JWT_SECRET_KEY, {}, (err, token) => {
      if (err) throw err;
      res.status(200).cookie("token", token).json({
        message: "Profile updated successfully",
      });
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const profileImagePath = req.file.path;
    const { id } = req.params;

    await userModel.findByIdAndUpdate(
      id,
      { profileImagePath: profileImagePath },
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({ profileImagePath });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

export const deleteProfileImage = async (req, res) => {
  try {
    const { profileImagePath } = req.query;
    const { id } = req.params;

    const filePath = path.join(import.meta.dirname, "..", profileImagePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        if (err.code === "ENOENT") {
          res.status(404).json({ message: "Image file not found" });
        } else {
          res.status(500).json({ message: "Error deleting file", error: err });
        }
      }
    });

    await userModel.findByIdAndUpdate(
      id,
      { $unset: { profileImagePath: null } },
      {
        new: true,
      }
    );

    res.status(200).json({ message: "Profile image deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
