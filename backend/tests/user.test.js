const mongoose = require("mongoose");
const helperLists = require("../utils/testDummyData");
const User = require("../models/users");
const Posts = require("../models/posts");
const Community = require("../models/communities");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const { passwordEncrypt } = require("../utils/testhelper");

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

describe("Checking if register is working", () => {
    test("Check if user can register with valid username,email and pass", async () => {
        await api
            .post("/api/users")
            .send(helperLists.userList[4])
            .expect(201)
            .expect("Content-Type", /json/);
    });
    test("Check if user can't register with username less than 6 letters", async () => {
        await api.post("/api/users").send(helperLists.userList[1]).expect(400);
    });
    test("Check if user can register with non-unique username", async () => {
        await api.post("/api/users").send(helperLists.userList[0]).expect(400);
    });
    test("Check if user can register with non-unique email", async () => {
        await api.post("/api/users").send(helperLists.userList[3]).expect(400);
    });
});

describe("Checking if password tests are working properly", () => {
    test("Check if user can't register with password less than 6 letters", async () => {
        await api.post("/api/users").send(helperLists.userList[2]).expect(400);
    });
    test("Check if user can't register with password without special character", async () => {
        await api.post("/api/users").send(helperLists.userList[5]).expect(400);
    });
    test("Check if user can't register with password without digit", async () => {
        await api.post("/api/users").send(helperLists.userList[6]).expect(400);
    });

    test("Check if user can't register with password without uppercase letter", async () => {
        await api.post("/api/users").send(helperLists.userList[7]).expect(400);
    });
    test("Check if user can't register with password without lowercase character", async () => {
        await api.post("/api/users").send(helperLists.userList[8]).expect(400);
    });
});

describe("Checking if email checks are fine", () => {
    test("check if email without @ works", async () => {
        await api.post("/api/users").send(helperLists.userList[9]).expect(400);
    });
    test("check if email without . works", async () => {
        await api.post("/api/users").send(helperLists.userList[9]).expect(400);
    });
    test("check if email with . before @ but not at end works", async () => {
        await api.post("/api/users").send(helperLists.userList[9]).expect(400);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
