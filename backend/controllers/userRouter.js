const User = require("../models/users");
const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const emailValidator = require("@Hamzakam/deep-email-validator");
const passwordValidator = require("password-validator");

const passSchema = new passwordValidator();
passSchema
    .is()
    .min(8)
    .is()
    .max(30)
    .has()
    .uppercase(1)
    .has()
    .lowercase(1)
    .has()
    .digits(1)
    .has()
    .symbols(1)
    .has()
    .not()
    .spaces();

require("express-async-errors");

userRouter.post("/", async (request, response) => {
    const body = request.body;
    if (!body.password || !passSchema.validate(body.password)) {
        throw { name: "credentialError", message: "Password too short" };
    }

    const { valid, reason, validators } = await emailValidator.validate(
        body.email
    );
    if (!valid) {
        throw { name: "credentialError", message: validators[reason].reason };
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
