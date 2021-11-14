//Creates an express application and uses middleware and routes

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const postsRouter = require("./controllers/postsRouter");
const userRouter = require("./controllers/userRouter");
const loginRouter = require("./controllers/loginRouter");
const communityRouter = require("./controllers/communityRouter");
const commentRouter = require("./controllers/commentRouter");
const replyRouter = require("./controllers/replyRouter");

const cors = require("cors");
const middleware = require("./utils/middleware");
const config = require("./utils/config");
const morgan = require("morgan");
const filter = require("content-filter");

const logger = require("./utils/logger");



app.use(cors());
app.use(express.static("build"));
app.use(express.json());

const filterOptions = ["$","{","&&","||"];
app.use(filter({
    urlBlackList:filterOptions,
    bodyBlackList:filterOptions,
}));

app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
);
mongoose
    .connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        logger.info(
            `MongoDB connected on Database ${result.connection.name} with models:`,
            result.models
        );
    })
    .catch((error) => {
        logger.error(error);
    });
app.use(middleware.tokenExtractor);
app.use(middleware.paginationHelper);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/posts", postsRouter);
app.use("/api/sub", communityRouter);
app.use("/api/comments", commentRouter);
app.use("/api/comments/r", replyRouter);
app.use(middleware.unknownEndPointHandler);
app.use(middleware.errorHandler);
module.exports = app;
