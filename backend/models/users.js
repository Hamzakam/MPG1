const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

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
    passwordHash: String,
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts",
            default: [],
        },
    ],
    communities: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Community",
            default: [],
        },
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: [],
        },
    ],
});

userSchema.plugin(uniqueValidator);
userSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.passwordHash;
    },
});

const User = new mongoose.model("User", userSchema);
module.exports = User;
