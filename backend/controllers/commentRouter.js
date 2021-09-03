const commentRouter = require("express").Router();
const Comment = require("../models/comments");
const { userExtractor } = require("../utils/middleware");
const Posts = require("../models/posts");
require("express-async-errors");

commentRouter.post("/", userExtractor, async (request, response) => {
    const body = request.body;
    const post = await Posts.findById(body.post);
    if (!post) {
        throw { name: "notFoundError" };
    }
    const comment = new Comment({
        content: body.content,
        post: post._id,
        user: request.user._id,
    });
    const commentObj = await comment.save();
    post.comments = post.comments.concat(commentObj._id);
    await post.save();
    response.status(201).json(commentObj);
});

commentRouter.get("/", async (request, response) => {
    const comments = await Comment.find({});
    response.status(200).json(comments);
});

module.exports = commentRouter;
