const User = require("../models/users");
const userRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const emailValidator = require("@Hamzakam/deep-email-validator");
const passwordValidator = require("password-validator");
const { userExtractor } = require("../utils/middleware");
const Subscribe = require("../models/subscribe");
const {uploadToS3,uploadGeneric} = require("../utils/s3");
const upload = uploadGeneric("dp");
const fs = require("fs");

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

userRouter.post("/",upload.single("dp"), async (request, response) => {
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
    let dpLocation;
    if(request.file){
        const s3Upload = await uploadToS3(request.file);
        await fs.promises.unlink(request.file.path);
        dpLocation = s3Upload.key;
    }

    const user = new User({
        username: body.username,
        email: body.email,
        dp:dpLocation,
        passwordHash,
    });
    const savedUser = await user.save();
    response.status(201).json(savedUser);
});

userRouter.get("/",async(request,response)=>{
    
    const users = request.query.username
        ? await User.findOne({ username: request.query.username })
        : await User.find({})
            .skip(request.body.offset * request.body.limit)
            .limit(request.body.limit);
    
    if (!users) {
        throw { name: "notFoundError" };
    }
    response.status(200).json(users);
});
userRouter.get("/subscribed", userExtractor, async (request, response) => {
    const subscribed = await Subscribe.find(
        { $user: request.user._id },
        { community: 1 }
    );
    response.status(200).json(subscribed);
});

module.exports = userRouter;
