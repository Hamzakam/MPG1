const logger = require("./logger");
const User = require("../models/users");
const Community = require("../models/communities");
const jwt = require("jsonwebtoken");
const config = require("./config");
const Comment = require("../models/comments");
const Reply = require("../models/replies");
const Posts = require("../models/posts");

const errorHandler = (error, request, response, next) => {
    logger.error(error);
    if (error.name === "CastError") {
        return response.status(400).json({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    } else if (error.name === "credentialError") {
        return response
            .status(401)
            .json({ error: "Invalid password or username" });
    } else if (error.name === "notFoundError") {
        return response.status(404).json({ error: "No Resource Error" });
    } else if (
        error.name === "unauthorizedAccessError" ||
        error.name === "jsonWebTokenError"
    ) {
        return response
            .status(401)
            .json({ error: "Access to resource denied" });
    }
    next(error);
};

const unknownEndPointHandler = (request, response) => {
    response.status(404).json({ error: "Unknown Endpoint" });
};

const tokenExtractor = (request, response, next) => {
    const auth = request.get("authorization");

    request.token =
        auth && auth.toLowerCase().startsWith("bearer ")
            ? auth.substring(7)
            : null;
    next();
};

const userExtractor = async (request, response, next) => {
    const decodedToken =
        request.token != null ? jwt.verify(request.token, config.SECRET) : null;
    if (!request.token || !decodedToken) {
        throw { name: "jsonWebTokenError" };
    }
    const user = await User.findById(decodedToken.id);
    request.user = user;
    next();
};

const communityExtractor = async (request, response, next) => {
    const id = request.params.id || request.body.community;
    const community = await Community.findById(id);
    if (!community) {
        throw { name: "notFoundError" };
    } else if (community.createdBy.toString() !== request.user._id.toString()) {
        throw { name: "unauthorizedAccessError" };
    }
    request.community = community;
    next();
};
const postExtractor = async (request, response, next) => {
    const id = request.params.id || request.body.post;
    const post = await Posts.findById(id);
    if (!post) {
        throw { name: "notFoundError" };
    } else if (post.user.toString() !== request.user._id.toString()) {
        throw { name: "unauthorizedAccessError" };
    }
    request.post = post;
    next();
};

const commentExtracter = async (request, response, next) => {
    const id = request.params.id || request.body.comment;
    const comment = await Comment.findById(id);
    console.log(comment);
    if (!comment) {
        throw { name: "notFoundError" };
    } else if (comment.user.toString() !== request.user._id.toString()) {
        throw { name: "unauthorizedAccessError" };
    }

    request.comment = comment;
    next();
};

const replyExtractor = async (request, response, next) => {
    const id = request.params.id;
    const reply = await Reply.findById(id);
    if (!reply && reply.user.toString() === request.user._id.toString()) {
        throw { name: "unauthorizedAccessError" };
    }
    request.reply = reply;
    next();
};

module.exports = {
    errorHandler,
    unknownEndPointHandler,
    tokenExtractor,
    userExtractor,
    communityExtractor,
    postExtractor,
    commentExtracter,
    replyExtractor,
};
