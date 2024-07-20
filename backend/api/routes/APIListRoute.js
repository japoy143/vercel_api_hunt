const express = require("express");
const route = express.Router();

//auth middleware
const verify = require("../middleware/verifyJWT");

const {
  addNewAPI,
  getAPI,
  getAPIs,
  deleteAPI,
  updateAPI,
  getByName,
} = require("../controllers/APIListController");

//POST
route.post("/", addNewAPI);

//GET
route.get("/", getAPIs);

//GET SPECIFIC
route.get("/:id", getAPI);

//GETBYNAME
route.post("/name", getByName);

//DELETE
route.delete("/:id", deleteAPI);

//UPDATE
route.patch("/:id", verify, updateAPI);

module.exports = route;
