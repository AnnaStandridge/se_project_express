require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { errors } = require("celebrate");
const errorHandler = require("./middlewares/error-handler");

const { PORT = 3001 } = process.env;

const app = express();

mongoose.connect(
  "mongodb://127.0.0.1:27017/wtwr_db",
  (r) => {
    console.log("connected to db", r);
  },
  (e) => console.log("db error", e),
);

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});

const routes = require("./routes/index");

app.use(express.json());

app.use(cors());
app.use(requestLogger);
app.use(routes);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
