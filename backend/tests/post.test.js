const mongoose = require("mongoose");
const helperLists = require("../utils/testDummyData");
const User = require("../models/users");
const Posts = require("../models/posts");
const Community = require("../models/communities");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);

beforeAll(async () => {
    await User.deleteMany({});
    await Posts.deleteMany({});
    await Community.deleteMany({});
});

afterAll(() => {
    mongoose.connection.close();
});
