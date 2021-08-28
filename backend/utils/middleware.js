const logger = require("./logger");

const errorHandler = (error, request, response, next) => {
    logger.error(error);
    if (error.name === "CastError") {
        return response.status(400).json({ error: "malformatted id" });
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message });
    }
    next(error);
};

const unknownEndPointHandler = (request, response) => {
    response.status(404).json({ error: "Unknown Endpoint" });
};
module.exports = { errorHandler, unknownEndPointHandler };
