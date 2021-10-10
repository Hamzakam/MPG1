//Defining schema for Posts.

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const postsSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
    },
    content: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 300,
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
    updated_at: {
        type: Date,
        default: Date.now,
        required: "Must have the date when the post is updated",
    },
    tags: [
        {
            type: String,
            maxLength: 30,
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
    upvoted_by: [
        {
            user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            up: { type: Number, min: -1, max: 1 },
        },
    ],
    views: { type: mongoose.Schema.Types.ObjectId, ref: "Views" },
});

postsSchema.plugin(uniqueValidator);
postsSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.views;
    },
});

const Posts = new mongoose.model("Posts", postsSchema);

module.exports = Posts;
