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
    const communities = request.query.name
        ? await Community.findOne({ name: request.query.name })
        : await Community.find({});
    if (!communities) {
        throw { name: "notFoundError" };
    }
    response.status(200).json(communities);
});

communityRouter.get("/search", async (request, response) => {
    const searchInput = request.body.input;
    const searchReg = new RegExp(searchInput, "i");
    const communities = await Community.find({
        $or: [
            { name: searchReg },

            {
                $text: { $search: searchInput },
            },
        ],
    });
    if (!communities) {
        throw { name: "notFoundError" };
    }
    response.status(200).send(communities);
});

communityRouter.get("/:id", async (request, response) => {
    const id = request.params.id;
    const community = await Community.findById(id);
    if (!community) {
        throw { name: "notFoundError" };
    }
    response.status(200).json(community);
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
            updated_at: Date.now(),
        };
        const updatedCommunity = await Community.findByIdAndUpdate(
            id,
            community,
            {
                runValidators: true,
                new: true,
            }
        );
        response.status(200).json(updatedCommunity);
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
