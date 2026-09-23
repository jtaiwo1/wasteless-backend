const { Router } = require("express");
const userController = require("../controllers/users");

const userRouter = Router();

userRouter.get("/", userController.index);
userRouter.get("/:username", userController.getByUsername);

userRouter.post("/register", userController.register);
userRouter.post("/login", userController.login);



module.exports = userRouter;