const express = require("express");
const mongoose = require("mongoose");
const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to db", r);
  },
  (e) => console.log("db error", e),
);

const routes = require("./routes/index");

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: "6513634c6c637d1e2e535c7",
  };
  next();
});

app.use(routes);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
