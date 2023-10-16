const ClothingItem = require("../models/clothingitem");
const { OK, CREATED, FORBIDDEN } = require("../utils/errors");
const { handleHttpError } = require("../utils/errorHandlers");

function getItems(req, res) {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((err) => {
      handleHttpError(req, res, err);
    });
}

function createItem(req, res) {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(CREATED).send({ data: item });
    })
    .catch((err) => {
      handleHttpError(req, res, err);
    });
}

function deleteItem(req, res) {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      console.log(item);
      if (item.owner.equals(req.user._id)) {
        return item.deleteOne().then(() => res.send({ item }));
      }

      const error = new Error();
      error.status = FORBIDDEN;
      error.name = "Forbidden";
      error.message = "Can only delete own cards";
      throw error;
    })
    .catch((err) => {
      handleHttpError(req, res, err);
    });
}

function likeItem(req, res) {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((like) => {
      res.status(OK).send(like);
    })
    .catch((err) => {
      handleHttpError(req, res, err);
    });
}

function dislikeItem(req, res) {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((dislike) => {
      res.status(OK).send(dislike);
    })
    .catch((err) => {
      handleHttpError(req, res, err);
    });
}

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
