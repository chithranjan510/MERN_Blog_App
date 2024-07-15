import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

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

    jwt.sign(
      { email, id: user._id },
      process.env.JWT_SECRET_KEY,
      {},
      (err, token) => {
        if (err) throw err;
        res
          .status(200)
          .cookie("token", token)
          .json({ message: "logged in successfully" });
      }
    );
  } catch (error) {
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

    const data = await userModel.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json(error);
  }
};

export const verifyUserToken = async (req, res) => {
  try {
    const { token } = req.cookies;
    JsonWebToken.verify(token, process.env.JWT_SECRET_KEY, {}, (err, data) => {
      if (err) throw err;
      res.json(data);
    });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong, Please try again" });
  }
};
