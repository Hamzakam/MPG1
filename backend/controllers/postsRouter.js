//Creates express.Router PostsRouter and assigns get,getbyid,post,put,delete.
//using express-async-errors as wrapper for throwing/catching/passing errors.

const Posts = require("../models/posts");
const postsRouter = require("express").Router();
const {
    userExtractor,
    communityExtractor,
    postExtractor,
} = require("../utils/middleware");
require("express-async-errors");

postsRouter.get("/", async (request, response) => {
    const posts = await Posts.find({}).populate("comments", {
        content: 1,
    });
    response.json(posts);
});

postsRouter.get("/:id", async (request, response) => {
    const post = await Posts.findById(request.params.id);
    response.json(post);
});

postsRouter.post(
    "/",
    userExtractor,
    communityExtractor,
    async (request, response) => {
        const postsObject = new Posts({
            title: request.body.title,
            content: request.body.content,
            tags: request.body.tags,
            user: request.user._id,
            community: request.community._id,
        });
        const savedPost = await postsObject.save();
        request.user.posts = request.user.posts.concat(savedPost._id);
        request.community.posts = request.community.posts.concat(savedPost._id);
        await request.user.save();
        await request.community.save();
        response.status(201).json(savedPost);
    }
);

postsRouter.put(
    "/:id",
    userExtractor,
    postExtractor,
    async (request, response) => {
        const posts = {
            title: request.body.title,
            content: request.body.content,
            tags: request.body.tags,
        };
        const postUpdated = await Posts.findByIdAndUpdate(
            request.params.id,
            posts,
            {
                runValidators: true,
                new: true,
            }
        );
        response.status(200).json(postUpdated);
    }
);

// postsRouter.put("/upvote", userExtractor, async (request, response) => {
//     const id = request.params.id;
//     const posts = {
//         title: request.body.title,
//         content: request.body.content,
//         tags: request.body.tags,
//     };
//     const post = await Posts.findById(id);
//     if (!post && post.user._id.toString() !== request.user._id.toString()) {
//         throw { name: "unauthorizedAccessError" };
//     }
//     const postUpdated = await Posts.findByIdAndUpdate(
//         request.params.id,
//         posts,
//         {
//             runValidators: true,
//             new: true,
//         }
//     );
//     response.status(200).json(postUpdated);
// });

postsRouter.delete(
    "/:id",
    userExtractor,
    postExtractor,
    async (request, response) => {
        await Posts.findByIdAndDelete(request.params.id);
        response.status(204).json({ message: "successful deletion" });
    }
);

module.exports = postsRouter;
