const mongoose = require("mongoose");
const helperLists = require("../utils/testDummyData");
const User = require("../models/users");
// const Posts = require("../models/posts");
const Community = require("../models/communities");
const supertest = require("supertest");
const app = require("../app");
const {
    usersInDb,
    userCreate,
    communitiesInDb,
} = require("../utils/testhelper");
const api = supertest(app);

beforeAll(async () => {
    await User.deleteMany({});
    await Community.deleteMany({});
    await userCreate(helperLists.userList[0]);
});

describe("Check if getting all community work", () => {
    beforeAll(async () => {
        const savedUser = await usersInDb();
        const communities = helperLists.communityList
            .slice(0, 4)
            .map((community) => {
                return new Community({
                    ...community,
                    user: savedUser[0]._id,
                });
            });
        await Community.insertMany(communities);
    });
    test("check if you can get community and status code is 200", async () => {
        await api.get("/api/sub").expect(200).expect("Content-Type", /json/);
    });
    test("check if get by id is working", async () => {
        const communities = await communitiesInDb();
        await api
            .get(`/api/sub/${communities[0]._id}`)
            .expect(200)
            .expect("Content-Type", /json/);
    });
    test("Check if get by invalid id gives malformatted id", async () => {
        const invalidId = "abcdefghijklomen";
        await api.get(`/api/sub/${invalidId}`).expect(400);
    });
    test("Check if get by nonexisting id gives non found", async () => {
        const nonExistingId = "6140c5c71e54fd85e0dfb7d0";
        await api.get(`/api/sub/${nonExistingId}`).expect(404);
    });
});

describe("Check if user can make a community", () => {
    beforeEach(async () => {
        await Community.deleteMany({});
    });
    test("check if logged in user can make a community", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const community = {
            ...helperLists.communityList[0],
        };
        const communities = await communitiesInDb();
        await api
            .post("/api/sub")
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(community)
            .expect(201)
            .expect("Content-Type", /json/);
        const communitesAfter = await communitiesInDb();
        expect(communitesAfter).toHaveLength(communities.length + 1);
    });
    test("can't create make a community with less than three words in title", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const community = {
            ...helperLists.communityList[5],
        };
        const communities = await communitiesInDb();
        await api
            .post("/api/sub")
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(community)
            .expect(400)
            .expect("Content-Type", /json/);
        const communitesAfter = await communitiesInDb();
        expect(communitesAfter).toHaveLength(communities.length);
    });
    test("create make a community with a description too small", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const community = {
            ...helperLists.communityList[3],
            description: "Not aml",
        };
        const communities = await communitiesInDb();

        await api
            .post("/api/sub")
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(community)
            .expect(400)
            .expect("Content-Type", /json/);
        const communitesAfter = await communitiesInDb();
        expect(communitesAfter).toHaveLength(communities.length);
    });
});

describe("Check if update community works", () => {
    beforeAll(async () => {
        await Community.deleteMany({});
        const savedUser = await usersInDb();
        const communities = helperLists.communityList
            .slice(0, 2)
            .map((community) => {
                return new Community({
                    ...community,
                    user: savedUser[0]._id,
                });
            });
        await Community.insertMany(communities);
    });
    test("If user can update community", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const communities = await communitiesInDb();
        const community = {
            description: communities[0].description + "Something",
        };
        const response = await api
            .put(`/api/sub/${communities[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(community)
            .expect(201)
            .expect("Content-Type", /json/);
        expect(response.body.description).toBe(
            communities[0].description + "Something"
        );
    });
    test("If another user can update community", async () => {
        await userCreate(helperLists.userList[1]);
        const { username, password } = helperLists.userList[1];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const communities = await communitiesInDb();
        const community = {
            description: communities[0].description + "Something",
        };
        await api
            .put(`/api/sub/${communities[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(community)
            .expect(401);
    });
    test("Check If validation is working", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const communities = await communitiesInDb();
        const community = {
            description: "fail pls",
        };
        await api
            .put(`/api/sub/${communities[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(community)
            .expect(400);
    });
});
describe("Check if delete community works", () => {
    beforeEach(async () => {
        await Community.deleteMany({});
        const savedUser = await usersInDb();
        const communities = helperLists.communityList
            .slice(0, 2)
            .map((community) => {
                return new Community({
                    ...community,
                    user: savedUser[0]._id,
                });
            });
        await Community.insertMany(communities);
    });
    test("If logged in user can delete community", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const communities = await communitiesInDb();
        await api
            .delete(`/api/sub/${communities[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .expect(204);
        const communitesAfter = await communitiesInDb();
        expect(communitesAfter).toHaveLength(communities.length - 1);
    });
    test("if non logged in user can delete community", async () => {
        const communities = await communitiesInDb();
        await api.delete(`/api/sub/${communities[0]._id}`).expect(401);
        const communitesAfter = await communitiesInDb();
        expect(communitesAfter).toHaveLength(communities.length);
    });
    test("if logged in but different user can delete community", async () => {
        await userCreate(helperLists.userList[2]);
        const { username, password } = helperLists.userList[1];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const communities = await communitiesInDb();
        await api
            .delete(`/api/sub/${communities[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .expect(401);
        const communitesAfter = await communitiesInDb();
        expect(communitesAfter).toHaveLength(communities.length);
    });
});
afterAll(async () => {
    await mongoose.connection.close();
});
