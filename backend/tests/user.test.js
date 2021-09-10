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

describe("Checking if register is working", () => {
    test("Check if user can register with valid username", async () => {
        await api
            .post("/api/users")
            .send(helperLists.userList[0])
            .expect(201)
            .expect("Content-Type", /json/);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
