//Creates an express application and uses middleware and routes

const express = require("express");
const app = express();

const mongoose = require("mongoose");

const postsRouter = require("./controllers/postsRouter");
const userRouter = require("./controllers/userRouter");
const loginRouter = require("./controllers/loginRouter");
const communityRouter = require("./controllers/communityRouter");

const cors = require("cors");
const middleware = require("./utils/middleware");
const config = require("./utils/config");
const morgan = require("morgan");

app.use(cors());
app.use(express.json());
app.use(
    morgan(":method :url :status :res[content-length] - :response-time ms")
);
mongoose
    .connect(config.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        console.log("MongoDB connected with ", result.models);
    })
    .catch((error) => {
        console.log(error);
    });
app.use(middleware.tokenExtractor);
app.use("/api/posts", postsRouter);
app.use("/api/users", userRouter);
app.use("/api/login", loginRouter);
app.use("/api/sub", communityRouter);

app.use(middleware.errorHandler);
app.use(middleware.unknownEndPointHandler);
module.exports = app;
