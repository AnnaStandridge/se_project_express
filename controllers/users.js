const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { OK, CREATED } = require("../utils/errors");
const { JWT_SECRET = "dev-key" } = process.env;
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const UnauthorizedError = require("../errors/unauthorized-error");
const ConflictError = require("../errors/conflict-error");

function login(req, res, next) {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("incorrect username or password"));
      }

      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.send({ token });
    })
    .catch(() => {
      next(new UnauthorizedError("Error from signinUser"));
    });
}

function createUser(req, res, next) {
  const { name, avatar, email, password } = req.body;

  if (!email) {
    next(new BadRequestError("Error from createUser"));
  }

  User.findOne({ email })
    .then((user) => {
      if (user) {
        return next(new ConflictError("Email already exists"));
      }

      return bcrypt.hash(password, 10).then((hash) => {
        User.create({ name, avatar, email, password: hash })
          .then((newUser) => {
            res.status(CREATED).send({
              name: newUser.name,
              email: newUser.email,
              avatar: newUser.avatar,
            });
          })
          .catch((e) => {
            console.error(e);
            if (e.name === "ValidationError") {
              next(new BadRequestError("Error from createUser"));
            } else {
              next(e);
            }
          });
      });
    })
    .catch((e) => {
      next(e);
    });
}

function getCurrentUser(req, res, next) {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.status(OK).send(user);
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Error from getUser"));
      } else if (e.name === "CastError") {
        next(new BadRequestError("Error from getUser"));
      } else {
        next(e);
      }
    });
}

function updateProfile(req, res, next) {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { name: req.body.name, avatar: req.body.avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => {
      res.status(OK).send({ user });
    })
    .catch((e) => {
      if (e.name === "DocumentNotFoundError") {
        next(new NotFoundError("Error from updateUser"));
      } else if (e.name === "ValidationError") {
        next(new BadRequestError("Error from updateUser"));
      } else {
        next(e);
      }
    });
}
module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
};
