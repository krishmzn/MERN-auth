const express = require("express");
const {register, login, passwordreset, forgot, forgotreset} = require("../controllers/userController");
const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.post("/password-reset", passwordreset);
userRouter.post("/password-forgot", forgot);
userRouter.post("/forgot-reset", forgotreset);

module.exports = userRouter;