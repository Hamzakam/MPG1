//Creates express.Router PostsRouter and assigns get,getbyid,post,put,delete.
//using express-async-errors as wrapper for throwing/catching/passing errors.

const Posts = require("../models/posts");
const postsRouter = require("express").Router();
const { userExtractor } = require("../utils/middleware");
require("express-async-errors");

postsRouter.get("/", (request, response, next) => {
    Posts.find({})
        .then((result) => response.json(result))
        .catch((error) => next(error));
});

postsRouter.get("/", async (request, response) => {
    const posts = await Posts.find({});
    response.json(posts);
});

postsRouter.get("/:id", async (request, response) => {
    const post = await Posts.findById(request.params.id);
    response.json(post);
});

postsRouter.post("/", userExtractor, async (request, response) => {
    const postsObject = new Posts({
        title: request.body.title,
        content: request.body.content,
        upvotes: request.body.upvotes,
        tags: request.body.tags,
    });
    const savedPost = await postsObject.save();
    request.user.posts = request.user.posts.concat(savedPost._id);
    response.status(201).end();
});

postsRouter.put("/:id", async (request, response) => {
    const posts = {
        title: request.body.title,
        content: request.body.content,
        upvotes: request.body.upvotes,
        tags: request.body.tags,
    };
    await Posts.findByIdAndUpdate(request.params.id, posts);
    response.status(200).end();
});

postsRouter.delete("/:id", async (request, response) => {
    await Posts.findByIdAndDelete(request.params.id);
    response.status(204).end();
});

module.exports = postsRouter;
