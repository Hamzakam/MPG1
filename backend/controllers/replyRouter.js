const replyRouter = require("express").Router();
const Posts = require("../models/posts");

const Reply = require("../models/replies");

const {
    userExtractor,
    commentExtracter,
    replyExtractor,
} = require("../utils/middleware");
require("express-async-errors");

replyRouter.post(
    "/",
    userExtractor,
    commentExtracter,
    async (request, response) => {
        const body = request.body;
        const post = await Posts.findById(body.post);
        if (!post) {
            throw { name: "notFoundError" };
        }
        const reply = new Reply({
            content: body.content,
            post: post._id,
            user: request.user._id,
        });
        const replyObj = await reply.save();
        request.comment.replies = request.comment.replies.concat(reply._id);
        await request.comment.save();
        response.status(201).json(replyObj);
    }
);

replyRouter.put(
    "/:id",
    userExtractor,
    commentExtracter,
    replyExtractor,
    async (request, response) => {
        const replyUpdated = await Reply.findByIdAndUpdate(
            request.params.id,
            { content: request.body.content },
            {
                runValidators: true,
                new: true,
            }
        );
        response.status(201).json(replyUpdated);
    }
);

replyRouter.delete(
    "/:id",
    userExtractor,
    commentExtracter,
    replyExtractor,
    async (request, response) => {
        await Reply.findByIdAndDelete(request.params.id);
        response.status(204).json({ message: "Successful Delete" });
    }
);

module.exports = replyRouter;
