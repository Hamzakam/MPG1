const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const postsRouter = require("./controllers/PostsRouter");
const middleware = require("./utils/middleware");
const app = express();
app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then((result) => {
        console.log("MongoDB connected with ", result.models);
    })
    .catch((error) => {
        console.log(error);
    });
app.use("/api/posts/", postsRouter);
app.use(middleware.errorHandler);
app.use(middleware.unknownEndPointHandler);
module.exports = app;
