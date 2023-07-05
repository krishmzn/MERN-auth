const express = require("express");
const {register, login, passwordreset} = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/password-reset", passwordreset);

module.export = userRouter;