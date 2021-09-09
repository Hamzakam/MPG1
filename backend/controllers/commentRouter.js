const commentRouter = require("express").Router();
const Comment = require("../models/comments");
const { userExtractor, commentExtracter } = require("../utils/middleware");
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
    const comments = await Comment.find({}).populate("replies", {
        content: 1,
        user: 1,
    });
    response.status(200).json(comments);
});

commentRouter.put(
    "/:id",
    userExtractor,
    commentExtracter,
    async (request, response) => {
        const commentUpdated = await Comment.findByIdAndUpdate(
            request.params.id,
            { content: request.body.content },
            {
                runValidators: true,
                new: true,
            }
        );
        response.status(201).json(commentUpdated);
    }
);

commentRouter.delete(
    "/:id",
    userExtractor,
    commentExtracter,
    async (request, response) => {
        await Comment.findByIdAndDelete(request.params.id);
        response.status(204).json({ message: "Successful Delete" });
    }
);

module.exports = commentRouter;
