/*
 * Creates PostsRouter(express.Router) and creates HTTP crud methods.
 */

const mongoose = require("mongoose");
const Posts = require("../models/posts");
const Views = require("../models/view");
const Votes = require("../models/vote");
const postsRouter = require("express").Router();
const {
    userExtractor,
    communityExtractor,
    postExtractor,
} = require("../utils/middleware");
require("express-async-errors");

//Returns posts based on specified query parameters.
postsRouter.get("/", async (request, response) => {
    const community = request.query.community;
    /** 
     * TODO: sort by-
     *  Most popular
     *  Most controversial
     *  latest
     *  oldest
     */
    /*
     * query for Most popular: 
     */
    
    const dbQuery = community?{community:mongoose.Types.ObjectId(community)}:{};
    
    const mostPopular = {
        $sort:{votes:-1,_id:1}    
      
    };
    const limitQuery = { "$limit": request.body.limit};
    const skipQuery = { "$skip": request.body.offset * request.body.limit };
    console.log([{$match:dbQuery},mostPopular,limitQuery,skipQuery]);
    const posts = await Posts.aggregate([{$match:dbQuery},mostPopular,limitQuery,skipQuery]);
    
    response.status(200).json(posts);
});

//Creates a post on client request in the db.
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
        response.status(201).json(savedPost);
    }
);

//Create a vote for the post in the db.
postsRouter.post("/vote", userExtractor,postExtractor, async (request, response) => {
    const vote = await Votes.findOne({
        user:request.user._id,
        post:request.post._id
    });
    const voteFactor = vote?(-vote.vote):0;
    const voteQuery = vote?{_id:vote._id}:{};
    await Votes.updateOne(voteQuery,{
        user:request.user._id,
        post:request.post._id,
        vote:request.body.vote
    },
    {
        runValidators: true,
        upsert:true,
        new: true,

    });
    const updatedPost = await Posts.findByIdAndUpdate(request.post._id,{$inc:{votes:request.body.vote+voteFactor}},{new:true});   
    response.status(201).json({votes:updatedPost.votes});
});

//Returns vote count for the requested post.
postsRouter.get("/vote",async(request,response)=>{
    const vote = await Votes.aggregate([
        {
            $match:{
                post:mongoose.Types.ObjectId(request.body.post)
            },
        },
        {$group: { _id: "$post", votes: { $sum: "$vote" } }}
    ]);
    response.status(200).json(vote[0]);
});

//creates a view if a user has seen the post.
postsRouter.post("/view", userExtractor, async (request, response) => {
    const id = request.body.post;
    const post = await Posts.findById(id);
    if (!post) {
        throw { name: "notFoundError" };
    }
    const views = await Views.findById(post.views);

    const hadSeen = views.users.findIndex((user) => {
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

//Returns the post by searching the _id in the db.
postsRouter.get("/:id", async (request, response) => {
    const id = request.params.id;
    const post = await Posts.findById(id);
    if (!post) {
        throw { name: "notFoundError" };
    }
    response.status(200).json(post);
});

//Updates and returns the new post.
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

//Deletes the post from database.
postsRouter.delete(
    "/:id",
    userExtractor,
    postExtractor,
    async (request, response) => {
        await Posts.findByIdAndDelete(request.params.id);
        response.status(204).end();
    }
);

module.exports = postsRouter;
