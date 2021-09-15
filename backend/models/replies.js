const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const replySchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 1,
        maxLength: 50,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: "Must have the date when the post is created",
    },
    updated_at: {
        type: Date,
        default: Date.now,
        required: "Must have the date when post is updated",
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Posts" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
});

replySchema.plugin(uniqueValidator);
replySchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Reply = new mongoose.model("Reply", replySchema);

module.exports = Reply;
