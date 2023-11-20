const ClothingItem = require("../models/clothingitem");
const { OK, CREATED } = require("../utils/errors");
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const ForbiddenError = require("../errors/forbidden-error");

function getItems(req, res, next) {
  ClothingItem.find({})
    .then((items) => {
      res.send(items);
    })
    .catch((e) => {
      next(e);
    });
}

function createItem(req, res, next) {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      res.status(CREATED).send({ data: item });
    })
    .catch((e) => {
      if (e.name === "ValidationError") {
        next(new BadRequestError("Error from createItem"));
      } else {
        next(e);
      }
    });
}

function deleteItem(req, res, next) {
  ClothingItem.findById(req.params.itemId)
    .orFail()
    .then((item) => {
      if (item.owner.equals(req.user._id)) {
        return next(
          new ForbiddenError("You are not authorized to delete this item"),
        );
      }
      return item.deleteOne().then(() => res.send({ message: "Item deleted" }));
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Error from deleteItem"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Error from deleteIte"));
      } else {
        next(e);
      }
    });
}

function likeItem(req, res, next) {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((like) => {
      res.status(OK).send(like);
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Error from likeItem"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Error from likeItem"));
      } else {
        next(e);
      }
    });
}

function dislikeItem(req, res, next) {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((dislike) => {
      res.status(OK).send(dislike);
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Error from dislikeItem"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Error from dislikeItem"));
      } else {
        next(e);
      }
    });
}

module.exports = {
  getItems,
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
