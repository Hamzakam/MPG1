const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/users");
const loginRouter = require("express").Router();
const config = require("../utils/config");
require("express-async-errors");

loginRouter.post("/", async (request, response) => {
    const body = request.body;
    const user = await User.findOne({ username: body.username });
    const isPassCorrect = !user
        ? null
        : await bcrypt.compare(body.password, user.passwordHash);
    if (!isPassCorrect && user) {
        throw { name: "credentialError" };
    }
    const token = jwt.sign(
        {
            username: user.username,
            id: user._id,
        },
        config.SECRET,
        { expiresIn: 3600 }
    );
    response.status(200).send({ token, username: user.username, id: user._id });
});

module.exports = loginRouter;
