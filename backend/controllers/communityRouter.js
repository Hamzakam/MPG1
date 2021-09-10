const communityRouter = require("express").Router();
const Community = require("../models/communities");
const { userExtractor, communityExtractor } = require("../utils/middleware");

require("express-async-errors");

communityRouter.post("/", userExtractor, async (request, response) => {
    const body = request.body;
    const community = new Community({
        name: body.name,
        description: body.description,
        user: request.user._id,
    });
    const communityObj = await community.save();
    response.status(201).json(communityObj);
});

communityRouter.get("/", async (request, response) => {
    const communities = await Community.find({});
    response.status(200).json(communities);
});

communityRouter.put(
    "/:id",
    userExtractor,
    communityExtractor,
    async (request, response) => {
        const id = request.params.id;
        const community = {
            description: request.body.description,
            tag: request.body.tags,
        };
        const updatedCommunity = await Community.findByIdAndUpdate(
            id,
            community,
            {
                runValidators: true,
                new: true,
            }
        );
        response.status(201).json(updatedCommunity);
    }
);

communityRouter.delete(
    "/:id",
    userExtractor,
    communityExtractor,
    async (request, response) => {
        const id = request.params.id;
        await Community.findByIdAndDelete(id);
        response.status(204).json({ message: "successful Delete" });
    }
);

module.exports = communityRouter;
