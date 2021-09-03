const User = require("../models/users");
const userRouter = require("express").Router();
const bcrypt = require("bcrypt");
require("express-async-errors");

userRouter.post("/", async (request, response) => {
    const body = request.body;
    if (!body.password || body.password.length < 3) {
        throw { name: "passwordError" };
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(body.password, saltRounds);
    const user = new User({
        username: body.username,
        email: body.email,
        passwordHash,
    });
    const savedUser = await user.save();
    response.status(201).json(savedUser);
});

userRouter.get("/", async (request, response) => {
    const users = await User.find({}).populate("posts", {
        title: 1,
        content: 1,
    });
    response.json(users);
});

module.exports = userRouter;
