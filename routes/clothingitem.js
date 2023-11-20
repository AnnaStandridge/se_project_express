const express = require("express");

const router = express.Router();

const {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingitem");

const { validateCardBody, validateId } = require("../middlewares/validation");

const { authorize } = require("../middlewares/auth");

router.get("/", getItems);

router.post("/", authorize, validateCardBody, createItem);

router.delete("/:itemId", authorize, validateId, deleteItem);

router.delete("/:itemId/likes", authorize, validateId, dislikeItem);

router.put("/:itemId/likes", authorize, validateId, likeItem);

module.exports = router;
