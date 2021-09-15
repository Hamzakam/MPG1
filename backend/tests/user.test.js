const mongoose = require("mongoose");
const helperLists = require("../utils/testDummyData");
const User = require("../models/users");
const Posts = require("../models/posts");
const Community = require("../models/communities");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const { userCreate } = require("../utils/testhelper");
const jwt = require("jsonwebtoken");
const { SECRET } = require("../utils/config");

beforeEach(async () => {
    await User.deleteMany({});
    await Posts.deleteMany({});
    await Community.deleteMany({});
});

describe("Checking if register is working", () => {
    test("Check if user can register with valid username,email and pass", async () => {
        await api
            .post("/api/users")
            .send(helperLists.userList[2])
            .expect(201)
            .expect("Content-Type", /json/);
    });
    test("Check if user can't register with username less than 6 letters", async () => {
        await api.post("/api/users").send(helperLists.userList[3]).expect(400);
    });
    test("Check if user can register with non-unique username", async () => {
        await userCreate(helperLists.userList[0]);
        await api.post("/api/users").send(helperLists.userList[0]).expect(400);
    });
    test("Check if user can register with non-unique email", async () => {
        await userCreate(helperLists.userList[0]);
        await api.post("/api/users").send(helperLists.userList[5]).expect(400);
    });
});

describe("Checking if password tests are working properly", () => {
    test("Check if user can't register with password less than 6 letters", async () => {
        await api.post("/api/users").send(helperLists.userList[4]).expect(400);
    });
    test("Check if user can't register with password without special character", async () => {
        await api.post("/api/users").send(helperLists.userList[7]).expect(400);
    });
    test("Check if user can't register with password without digit", async () => {
        await api.post("/api/users").send(helperLists.userList[8]).expect(400);
    });

    test("Check if user can't register with password without uppercase letter", async () => {
        await api.post("/api/users").send(helperLists.userList[9]).expect(400);
    });
    test("Check if user can't register with password without lowercase character", async () => {
        await api.post("/api/users").send(helperLists.userList[10]).expect(400);
    });
});

describe("Checking if email checks are fine", () => {
    test("check if email without @ works", async () => {
        await api.post("/api/users").send(helperLists.userList[11]).expect(400);
    });
    test("check if email without . works", async () => {
        await api.post("/api/users").send(helperLists.userList[12]).expect(400);
    });
    test("check if email with . before @ but not at end works", async () => {
        await api.post("/api/users").send(helperLists.userList[13]).expect(400);
    });
});

describe("Checking if login work", () => {
    test("Check if valid user login and generate a verifiable JWT token", async () => {
        await userCreate(helperLists.userList[0]);
        const { username, password } = helperLists.userList[0];
        const response = await api
            .post("/api/login")
            .send({ username, password });
        expect(response.body.token).toBeDefined();

        const decodedToken = jwt.verify(response.body.token, SECRET);
        expect(decodedToken.id.toString() === response.body.id);
        expect(decodedToken.username === username);
    });
    test("Check if non-valid user can login", async () => {
        await userCreate(helperLists.userList[0]);
        const { username, password } = helperLists.userList[1];
        const response = await api
            .post("/api/login")
            .send({ username, password });
        expect(response.body.token).toBeUndefined();
    });
});

afterAll(() => {
    mongoose.connection.close();
});
