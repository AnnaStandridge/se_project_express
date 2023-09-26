const express = require("express");

const router = express.Router();
const { createUser, getUsers, getUser } = require("../controllers/users");

router.post("/", createUser);

router.get("/", getUsers);

router.get("/:userId", getUser);

module.exports = router;
