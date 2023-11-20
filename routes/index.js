const router = require("express").Router();
const clothingItem = require("./clothingitem");
const user = require("./users");
const { login, createUser } = require("../controllers/users");
const NotFoundError = require("../errors/not-found-error");
const { authorize } = require("../middlewares/auth");
const {
  validatedUserLogin,
  validateUserBody,
} = require("../middlewares/validation");

router.use("/items", clothingItem);
router.use("/users", authorize, user);

router.post("/signin", validatedUserLogin, login);
router.post("/signup", validateUserBody, createUser);
router.use((req, res, next) => {
  next(new NotFoundError("Requested resource not found"));
});

module.exports = router;
