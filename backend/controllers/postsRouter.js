//Creates express.Router PostsRouter and assigns get,getbyid,post,put,delete.
//using express-async-errors as wrapper for throwing/catching/passing errors.

const Posts = require("../models/posts");
const postsRouter = require("express").Router();
const { userExtractor } = require("../utils/middleware");
require("express-async-errors");

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
        user: request.user._id,
    });
    const savedPost = await postsObject.save();
    request.user.posts = request.user.posts.concat(savedPost._id);
    await request.user.save();
    response.status(201).json({ message: "Successful Post" });
});

postsRouter.put("/:id", userExtractor, async (request, response) => {
    const id = request.params.id;
    const posts = {
        title: request.body.title,
        content: request.body.content,
        tags: request.body.tags,
    };
    const post = await Posts.findById(id);
    if (post && post.user._id.toString() === request.user._id.toString()) {
        await Posts.findByIdAndUpdate(request.params.id, posts);
        response.status(200).end();
    } else {
        throw { name: "unauthorizedAccessError" };
    }
});

postsRouter.delete("/:id", userExtractor, async (request, response) => {
    const id = request.params.id;
    const post = await Posts.findById(id);
    if (post.user._id.toString() === request.user._id.toString()) {
        await Posts.findByIdAndDelete(request.params.id);
        response.status(204).json({ message: "successful deletion" });
    } else {
        throw { name: "unauthorizedAccessError" };
    }
});

module.exports = postsRouter;
