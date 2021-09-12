const mongoose = require("mongoose");
const helperLists = require("../utils/testDummyData");
const User = require("../models/users");
const Posts = require("../models/posts");
const Community = require("../models/communities");
const supertest = require("supertest");
const app = require("../app");
const { passwordEncrypt, postsInDb } = require("../utils/testhelper");
const api = supertest(app);

beforeEach(async () => {
    await User.deleteMany({});
    await Posts.deleteMany({});
    await Community.deleteMany({});
    const passwordHash = await passwordEncrypt(
        helperLists.userList[0].password
    );
    const user = new User({
        ...helperLists.userList[0],
        passwordHash,
    });
    await user.save();
});

describe("Check if getting all posts work", () => {
    test("check if you can get post and status code is 200", async () => {
        api.get("/api/posts").expect(200).expect("Content-Type", /json/);
    });
    test("check if get by id is working", async () => {
        const posts = await postsInDb();
        api.get(`/api/posts/${posts[0]._id}`)
            .expect(200)
            .expect("Content-Type", /json/);
    });
    test("Check if get by invalid id gives malformatted id", async () => {
        const invalidId = "abcdefghijklomen";
        api.get(`/api/posts/${invalidId}`).expect(400);
    });
});

describe("Check if user can make a post", () => {
    // test("check if non-logged in user can make a post", async () => {
    //     const loggedInUser = await api
    //         .post("/api/posts")
    //         .send(helperLists.userList[0]);
    // });
});

afterAll(() => {
    mongoose.connection.close();
});
