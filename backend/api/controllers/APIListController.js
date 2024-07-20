const mongoose = require("mongoose");
const api_list = require("../models/APIListModel");

//add API
const addNewAPI = async (req, res) => {
  const {
    name,
    category,
    link,
    description,
    key,
    likes,
    isCommentSection,
    comments,
    isLikeHover,
  } = req.body;
  try {
    const newAPI = await api_list.create({
      name: name,
      category: category,
      link: link,
      description: description,
      key: key,
      likes: likes,
      isCommentSection: isCommentSection,
      comments: comments,
      isLikeHover: isLikeHover,
    });
    return res
      .status(200)
      .json({ message: "Data Inserted Successfully", newAPI });
  } catch (error) {
    return res.status(404).json({ Message: "Data Insertion Failed" });
  }
};

//Fetch API's
const getAPIs = async (req, res) => {
  try {
    const APIs = await api_list.find({}).sort({ createdAt: -1 });
    return res.status(200).json(APIs);
  } catch (error) {
    return res.status(404).json({ Message: "Data Fetching Failed" });
  }
};

//Get API
const getAPI = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ Message: "Invalid ID" });
  }

  const API = await api_list.findById({ _id: id });

  if (!API) {
    return res.status(404).json({ Message: "Data not Found" });
  }

  return res.status(200).json({ Message: "Data Found", API });
};

const getByName = async (req, res) => {
  const { name } = req.body;
  const API = await api_list.findOne({ name });
  if (!API) {
    return res.status(200).json("NotExist");
  } else {
    return res.status(404).json("Exist");
  }
};

//delete API
const deleteAPI = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ Message: "Invalid ID" });
  }

  const api = await api_list.findByIdAndDelete({ _id: id });

  if (!api) {
    return res.status(404).json({ Message: "Data Not Deleted" });
  }

  return res.status(200).json({ Message: "Data Deleted Successfully", api });
};

const updateAPI = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ Message: "Invalid ID" });
  }

  const api = await api_list.findByIdAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!api) {
    return res.status(404).json({ Message: "Data Not Updated" });
  }
  return res.status(200).json({ Message: "Data Updated Successfully", api });
};

module.exports = {
  addNewAPI,
  getAPIs,
  getAPI,
  deleteAPI,
  updateAPI,
  getByName,
};
