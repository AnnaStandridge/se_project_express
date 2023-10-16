const express = require("express");

const router = express.Router();

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingitem");

const { authorize } = require("../middlewares/auth");

router.get("/", getItems);

router.post("/", authorize, createItem);

router.delete("/:itemId", authorize, deleteItem);

router.delete("/:itemId/likes", authorize, dislikeItem);

router.put("/:itemId/likes", authorize, likeItem);

module.exports = router;
