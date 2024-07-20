const mongoose = require("mongoose");
const user = require("../models/userModel");

require("dotenv").config();

//encryption
const bcrypt = require("bcrypt");

//jwt
const jwt = require("jsonwebtoken");

//add user
const addUser = async (req, res) => {
  const { email, password, avatar, isLogin } = req.body;
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  try {
    const newUser = await user.create({
      email: email,
      password: hashedPassword,
      avatar: avatar,
      isLogin: isLogin,
    });
    return res.status(200).json({ Message: "Sign Up Successfully", newUser });
  } catch (error) {
    return res.status(404).json("Sign Up Failed");
  }
};

//get all user
const getAllUser = async (req, res) => {
  try {
    const users = await user.find({}).sort({ createdAt: -1 });
    return res.status(200).json({ Message: "Data Fetch", users });
  } catch (error) {
    return res.status(404).json("Data Fetch Error");
  }
};

//Generate token function
const generateToken = (user, secretKey, expireTime) => {
  return jwt.sign({ id: user.id, email: user.email }, `${secretKey}`, {
    expiresIn: expireTime,
  });
};

//user validation
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const isUser = await user.findOne({ email });
  if (!isUser) {
    return res.sendStatus(203);
  }

  const isMatch = await bcrypt.compare(password, isUser.password);

  if (isMatch) {
    //generate access token
    const accessToken = generateToken(isUser, process.env.ACCESS_TOKEN, "30s");
    //generate refresh token
    const refreshToken = generateToken(
      isUser,
      process.env.REFRESH_TOKEN,
      "15h"
    );
    res.cookie("token", refreshToken, {
      httpOnly: true,
    });

    return res.status(200).json({
      Message: "Success",
      id: isUser._id,
      email: email,
      avatar: isUser.avatar,
      likes: isUser.likes,
      accessToken,
    });
  } else {
    return res.status(200).json("Incorrect Password");
  }
};

//logout user
const logoutUser = (req, res) => {
  const refreshToken = req.cookies.token;
  if (!refreshToken) return res.status(403).json("Invalid Token");
  res.clearCookie("token");
  res.status(200).json("You Logout Successfully");
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json("Invalid ID");
  }

  const User = await user.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!User) {
    return res.status(404).json("Data Not Updated");
  }
  return res.status(200).json("Updated Successfully");
};

//refresh tokens
const handleRefreshToken = (req, res) => {
  //take the refresh token from the user
  const refreshToken = req.cookies.token;

  //send error if there is no token or it's invalid
  if (!refreshToken) return res.status(401).json("Not Authenticated");

  jwt.verify(refreshToken, `${process.env.REFRESH_TOKEN}`, (err, user) => {
    err && console.log(err);
    res.clearCookie("token");
    const newAccessToken = generateToken(user, process.env.ACCESS_TOKEN, "15m");
    const newRefreshToken = generateToken(
      user,
      process.env.REFRESH_TOKEN,
      "1d"
    );

    res.cookie("token", newRefreshToken, {
      httpInly: true,
    });

    res.status(200).json({
      accessToken: newAccessToken,
    });
  });
};

//delete User
const deleteUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ Message: "Invalid ID" });
  }

  const User = await user.findByIdAndDelete({ _id: id });

  if (!User) {
    return res.status(404).json({ Message: "Data Not Deleted" });
  }

  return res.status(200).json({ Message: "Data Deleted Successfully", User });
};

module.exports = {
  addUser,
  loginUser,
  logoutUser,
  getAllUser,
  updateUser,
  handleRefreshToken,
  deleteUser,
};
