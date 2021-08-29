//Defining schema fro Posts.

const mongoose = require("mongoose");

const PostsSchema = mongoose.Schema({
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
    tags: {
        type: [String],
        default: [],
    },
});

PostsSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Posts = new mongoose.model("Posts", PostsSchema);

module.exports = Posts;
