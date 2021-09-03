//Defining schema for Posts.

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const postsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
    },
    content: {
        type: String,
        required: true,
        minLength: 10,
    },
    upvotes: {
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
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
});

postsSchema.plugin(uniqueValidator);
postsSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Posts = new mongoose.model("Posts", postsSchema);

module.exports = Posts;
