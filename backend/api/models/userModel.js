const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const User = new Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: Number,
      required: false,
      default: null,
    },
    isLogin: {
      type: Boolean,
      required: true,
    },
    likes: {
      type: [],
      required: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Users", User);
