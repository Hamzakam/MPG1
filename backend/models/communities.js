//Defining schema for Posts.

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const communitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
        unique: true,
    },
    description: {
        type: String,
        required: true,
        minLength: 20,
        maxLength: 100,
    },
    members: {
        type: Number,
        default: 0,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: "Must have the date when the post is created",
    },
    tags: [
        {
            type: String,
        },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Posts",
        },
    ],
});

communitySchema.plugin(uniqueValidator);

communitySchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Community = new mongoose.model("Community", communitySchema);

module.exports = Community;
