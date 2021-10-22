//Creating community router
const communityRouter = require("express").Router();
//Models for document manipulation
const Community = require("../models/communities");
const Subscribe = require("../models/subscribe");
//middleware for verifying user and permission for community manipulation
const { userExtractor, communityExtractor } = require("../utils/middleware");
require("express-async-errors");

//Handling image upload
const fs = require("fs");
const { uploadToS3, uploadGeneric } = require("../utils/s3");
const upload = uploadGeneric("community");


//Images are at the url https://<bucketName>.s3.<bucketRegion>.amazonaws.com/<logoPath>
communityRouter.post(
    "/",
    userExtractor,
    upload.single("community"),
    async (request, response) => {
        let logoPath;
        if(request.file){
            const s3Upload = await uploadToS3(request.file);
            await fs.promises.unlink(request.file.path);
            logoPath = s3Upload.key;
        }
        const community = new Community({
            name: request.body.name,
            description: request.body.description,
            user: request.user._id,
            logo: logoPath,
        });
        const communityObj = await community.save();
        response.status(201).json(communityObj);
    }
);


communityRouter.get("/", async (request, response) => {
    const communities = request.query.name
        ? await Community.findOne({ name: request.query.name })
        : await Community.find({})
            .skip(request.body.offset * request.body.limit)
            .limit(request.body.limit);
    if (!communities) {
        throw { name: "notFoundError" };
    }
    response.status(200).json(communities);
});

communityRouter.get("/search", async (request, response) => {
    const searchFilter = request.query.filter;
    if (!searchFilter || searchFilter === "") {
        throw {
            name: "ValidationError",
            message: "The filter is not defined or is empty.",
        };
    }
    const searchReg = new RegExp(searchFilter, "i");
    const communities = await Community.find(
        {
            $or: [
                { name: searchReg },

                {
                    $text: { $search: searchFilter },
                },
            ],
        },
        {
            name: 1,
            description: 1,
        }
    )
        .skip(request.body.offset * request.body.limit)
        .limit(request.body.limit);
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
        const updatedCommunity = await Community.findByIdAndUpdate(id, community, {
            runValidators: true,
            new: true,
        });
        response.status(200).json(updatedCommunity);
    }
);

communityRouter.post(
    "/follow",
    userExtractor,
    communityExtractor,
    async (request, response) => {
        const sub = await Subscribe.updateOne(
            {
                $and: [
                    { user: request.user._id },
                    { community: request.community._id },
                ],
            },
            {
                user: request.user._id,
                community: request.community._id,
            },
            {
                runValidators: true,
                new: true,
                upsert: true,
            }
        );
        response.status(201).json(sub);
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
