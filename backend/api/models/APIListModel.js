const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const APIs = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    key: {
      type: Boolean,
      required: true,
    },
    likes: {
      type: [],
      required: true,
    },
    comments: {
      type: [],
      required: true,
    },
    isCommentSection: {
      type: Boolean,
      required: true,
    },
    isLikeHover: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("APIs", APIs);
