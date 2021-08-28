const Posts = require("../models/posts");
const postsRouter = require("express").Router();
require("express-async-errors");
postsRouter.get("/", async (request, response) => {
    const posts = await Posts.find({});
    response.json(posts);
});

postsRouter.get("/:id", async (request, response) => {
    const post = await Posts.findById(request.params.id);
    response.json(post);
});

postsRouter.post("/", async (request, response) => {
    const postsObject = new Posts({
        title: request.body.title,
        content: request.body.content,
    });
    await postsObject.save();
    response.status(201).end();
});

postsRouter.put("/:id", async (request, response) => {
    const posts = {
        title: request.body.title,
        content: request.body.content,
        upvotes: request.body.upvotes,
    };
    await Posts.findByIdAndUpdate(request.params.id, posts);
    response.status(200).end();
});

postsRouter.delete("/:id", async (request, response) => {
    await Posts.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

module.exports = postsRouter;
