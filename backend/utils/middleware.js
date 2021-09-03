const logger = require("./logger");
const User = require("../models/users");
const jwt = require("jsonwebtoken");
const config = require("./config");

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
    } else if (error.name === "unauthorizedAccessError") {
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
    const decodedToken = jwt.verify(request.token, config.SECRET);
    if (!request.token || !decodedToken) {
        throw { name: "jsonWebTokenError" };
    }
    const user = await User.findById(decodedToken.id);
    request.user = user;
    next();
};

module.exports = {
    errorHandler,
    unknownEndPointHandler,
    tokenExtractor,
    userExtractor,
};
