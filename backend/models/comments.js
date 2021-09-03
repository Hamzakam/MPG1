const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const commentSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 10,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: "Must have the date when the post is created",
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

commentSchema.plugin(uniqueValidator);
commentSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Comment = new mongoose.model("Comment", commentSchema);

module.exports = Comment;