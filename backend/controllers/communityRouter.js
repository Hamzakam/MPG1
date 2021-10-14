const communityRouter = require("express").Router();
const Community = require("../models/communities");
const Subscribe = require("../models/subscribe");
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
    const communities = await Community.find(
        {
            $or: [
                { name: searchReg },

                {
                    $text: { $search: searchInput },
                },
            ],
        },
        {
            name: 1,
            description: 1,
        }
    );
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

communityRouter.post(
    "/follow",
    userExtractor,
    communityExtractor,
    async (request, response) => {
        const isSubbed = await Subscribe.findOne({
            $and: [
                { user: request.user._id },
                { community: request.community._id },
            ],
        });
        if (isSubbed) {
            throw {
                name: "ValidationError",
                message: "Already Subscribed to this community",
            };
        }
        const sub = new Subscribe({
            user: request.user._id,
            community: request.community._id,
        });
        const subObject = await sub.save();
        response.status(200).json(subObject);
    }
);

communityRouter.delete("/follow", userExtractor, async (request, response) => {
    const community = await Community.findById(request.body.community);
    if (!community) {
        throw { name: "notFoundError" };
    }
    const isSubbed = await Subscribe.findOne({
        $and: [{ user: request.user._id }, { community: community._id }],
    });
    if (!isSubbed) {
        throw {
            name: "ValidationError",
            message: "Not subscribed to the community",
        };
    }
    await Subscribe.findByIdAndDelete(isSubbed._id);
    response.status(204).json({ message: "successful Delete" });
});

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
