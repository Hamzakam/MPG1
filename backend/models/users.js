const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const { AWS_BUCKET_NAME, AWS_BUCKET_REGION } = require("../utils/config");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        uniqueCaseInsensitive: true,
        minlength: 6,
        maxlength: 20,
    },
    email: {
        type: String,
        required: true,
        uniqueCaseInsensitive: true,
        unique: true,
    },
    dp:{
        type:String,
        default:"dp/default"
    },
    passwordHash: String,
});

userSchema.plugin(uniqueValidator);
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        returnedObject.dp = `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${returnedObject.dp}`;
        delete returnedObject.email;
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
