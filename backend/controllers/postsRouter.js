//Creates express.Router PostsRouter and assigns get,getbyid,post,put,delete.
//using express-async-errors as wrapper for throwing/catching/passing errors.

const Posts = require("../models/posts");
const Views = require("../models/view");
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
    response.status(200).json(posts);
});

postsRouter.get("/:id", async (request, response) => {
    const id = request.params.id;
    const post = await Posts.findById(id);
    if (!post) {
        throw { name: "notFoundError" };
    }
    response.status(200).json(post);
});

postsRouter.post(
    "/",
    userExtractor,
    communityExtractor,
    async (request, response) => {
        const viewObject = new Views();
        const savedView = await viewObject.save();
        const postsObject = new Posts({
            title: request.body.title,
            content: request.body.content,
            tags: request.body.tags,
            user: request.user._id,
            community: request.community._id,
            views: savedView._id,
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
        const postUpdated = await Posts.findByIdAndUpdate(
            request.params.id,
            {
                title: request.body.title,
                content: request.body.content,
                tags: request.body.tags,
                updated_at: Date.now(),
            },
            {
                runValidators: true,
                new: true,
            }
        );
        response.status(200).json(postUpdated);
    }
);

postsRouter.post("/up", userExtractor, async (request, response) => {
    const id = request.body.post;
    const post = await Posts.findById(id);
    console.log(post);
    if (!post) {
        throw { name: "notFoundError" };
    }
    const hadUpvoted = post.upvoted_by.findIndex(
        (upvote) => upvote.user.toString() === request.user._id.toString()
    );
    if (hadUpvoted === -1) {
        post.upvoted_by = post.upvoted_by.concat({
            user: request.user._id,
            up: request.body.up,
        });
    } else {
        post.upvotes -= post.upvoted_by[hadUpvoted].up;
        post.upvoted_by[hadUpvoted].up = request.body.up;
    }
    post.upvotes += request.body.up;
    const postUpdated = await post.save();
    response.status(200).json({ upvotes: postUpdated.upvotes });
});

postsRouter.post("/view", userExtractor, async (request, response) => {
    const id = request.body.post;
    const post = await Posts.findById(id);
    if (!post) {
        throw { name: "notFoundError" };
    }
    const views = await Views.findById(post.views);
    // console.log("Views:", views);

    const hadSeen = views.users.findIndex((user) => {
        // console.log(user.userid.toString());
        return user.userid.toString() === request.user._id.toString();
    });

    if (hadSeen === -1) {
        views.users = views.users.concat({
            userid: request.user._id,
        });
    } else {
        views.users[hadSeen] = {
            ...views.users[hadSeen]._doc,
            last_viewed: Date.now(),
        };
    }
    await views.save();
    response.status(200).end();
});

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
