const commentRouter = require("express").Router();
const Comment = require("../models/comments");
const {
    userExtractor,
    commentExtracter,
    postExtractor,
} = require("../utils/middleware");
require("express-async-errors");

commentRouter.post(
    "/",
    userExtractor,
    postExtractor,
    async (request, response) => {
        const body = request.body;
        const comment = new Comment({
            content: body.content,
            post: request.post._id,
            user: request.user._id,
        });
        const commentObj = await comment.save();
        request.post.comments = request.post.comments.concat(commentObj._id);
        await request.post.save();
        response.status(201).json(commentObj);
    }
);

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
