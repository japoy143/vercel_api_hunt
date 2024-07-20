const express = require("express");
require("dotenv").config();
require("colors");
const mongoose = require("mongoose");
const cors = require("cors");

//cookie parser
const cookiePaser = require("cookie-parser");

const app = express();

//PORT and MONGODB connection string

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(`DB Successfully connected`.blue);
  })
  .catch(() => console.log(`DB connection failed`.red));

//fix cookie
app.use(
  cors({
    origin: ["https://vercel-api-hunt-y8ha.vercel.app"],
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookiePaser());
// show all the method
app.use((req, res, next) => {
  console.log(req.path, req.method, req.params);
  next();
});

//TODO:change the route name
const APIRoute = require("./routes/APIListRoute");
const UserRoute = require("./routes/userRoute");
const EmailRoute = require("./routes/emailRoutes");

app.use("/APIs", APIRoute);

app.use("/Users", UserRoute);

app.use("/sendMail", EmailRoute);

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`serve at http://localhost:${PORT}`.blue);
});
