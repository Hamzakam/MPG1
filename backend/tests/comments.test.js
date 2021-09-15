const mongoose = require("mongoose");
const helperLists = require("../utils/testDummyData");
const User = require("../models/users");
const Posts = require("../models/posts");
const Community = require("../models/communities");
const Comment = require("../models/comments");
const supertest = require("supertest");
const app = require("../app");
const {
    userCreate,
    postsInDb,
    usersInDb,
    commentsInDb,
} = require("../utils/testhelper");
const api = supertest(app);

beforeAll(async () => {
    await User.deleteMany({});
    await Posts.deleteMany({});
    await Community.deleteMany({});
    await Comment.deleteMany({});

    const user = await userCreate(helperLists.userList[0]);
    const communityObjects = helperLists.communityList
        .slice(0, 4)
        .map((community) => {
            return {
                ...community,
                user: user._id,
            };
        });

    const communities = await Community.insertMany(communityObjects);
    const postObjects = helperLists.postList.slice(0, 3).map((post) => {
        return new Posts({
            user: user._id,
            community: communities[0]._id,
            ...post,
        });
    });
    await Posts.insertMany(postObjects);
});

describe("Check if getting all comment work", () => {
    beforeAll(async () => {
        await Comment.deleteMany({});
        const users = await usersInDb();
        const posts = await postsInDb();
        const commentObjects = helperLists.commentList
            .slice(0, 3)
            .map((comment) => {
                return new Comment({
                    user: users[0]._id,
                    post: posts[0]._id,
                    ...comment,
                });
            });
        await Comment.insertMany(commentObjects);
    });
    test("check if you can get comment and status code is 200", async () => {
        await api
            .get("/api/comments")
            .expect(200)
            .expect("Content-Type", /json/);
    });
    test("check if get by id is working", async () => {
        const comments = await commentsInDb();
        await api
            .get(`/api/comments/${comments[0]._id}`)
            .expect(200)
            .expect("Content-Type", /json/);
    });
    test("Check if get by invalid id gives malformatted id", async () => {
        const invalidId = "abcdefghijklomen";
        await api.get(`/api/comments/${invalidId}`).expect(400);
    });
});

describe("Check if user can make a comment", () => {
    beforeAll(async () => {
        await Comment.deleteMany({});
        const users = await usersInDb();
        const posts = await postsInDb();
        const commentObjects = helperLists.commentList
            .slice(0, 3)
            .map((comment) => {
                return new Comment({
                    user: users[0]._id,
                    post: posts[0]._id,
                    ...comment,
                });
            });
        await Comment.insertMany(commentObjects);
    });
    test("check if logged in user can make a comment", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const posts = await postsInDb();
        const commentObj = {
            ...helperLists.commentList[4],
            post: posts[0]._id,
        };
        const comments = await commentsInDb();
        await api
            .post("/api/comments")
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(commentObj)
            .expect(201)
            .expect("Content-Type", /json/);
        const commentsAfter = await commentsInDb();
        expect(commentsAfter).toHaveLength(comments.length + 1);
    });
    test("check if user(not post-creator) can make a comment", async () => {
        await userCreate(helperLists.userList[1]);
        const { username, password } = helperLists.userList[1];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const posts = await postsInDb();
        const commentObj = {
            ...helperLists.commentList[4],
            post: posts[0]._id,
        };
        const comments = await commentsInDb();
        await api
            .post("/api/comments")
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(commentObj)
            .expect(201)
            .expect("Content-Type", /json/);
        const commentsAfter = await commentsInDb();
        expect(commentsAfter).toHaveLength(comments.length + 1);
        await User.findByIdAndDelete(loggedInUser.body.id);
    });
    test("if comment validation is working(invalid content)", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const posts = await postsInDb();
        const commentObj = {
            content: "",
            post: posts[0]._id,
        };
        const comments = await commentsInDb();
        await api
            .post("/api/comments")
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(commentObj)
            .expect(400)
            .expect("Content-Type", /json/);
        const commentsAfter = await commentsInDb();
        expect(commentsAfter).toHaveLength(comments.length);
    });

    test("check if non-logged in user can make a comment", async () => {
        const posts = await postsInDb();
        const commentObj = {
            content: "",
            post: posts[0]._id,
        };
        const comments = await commentsInDb();
        await api.post("/api/comments").send(commentObj).expect(401);
        const commentsAfter = await commentsInDb();
        expect(commentsAfter).toHaveLength(comments.length);
    });
});

describe("Check if update comment works", () => {
    beforeAll(async () => {
        await Comment.deleteMany({});
        const users = await usersInDb();
        const posts = await postsInDb();
        const commentObjects = helperLists.commentList
            .slice(0, 3)
            .map((comment) => {
                return new Comment({
                    user: users[0]._id,
                    post: posts[0]._id,
                    ...comment,
                });
            });
        await Comment.insertMany(commentObjects);
    });
    test("If user can update comment", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const comments = await commentsInDb();
        const commentObj = {
            content: comments[0].content + "Something",
        };
        const response = await api
            .put(`/api/comments/${comments[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(commentObj)
            .expect(200)
            .expect("Content-Type", /json/);
        expect(response.body.content).toBe(comments[0].content + "Something");
    });
    test("If a user can update another user's comment", async () => {
        await userCreate(helperLists.userList[1]);
        const { username, password } = helperLists.userList[1];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const comments = await commentsInDb();
        const commentObj = {
            content: comments[0].content + "Something",
        };

        await api
            .put(`/api/comments/${comments[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(commentObj)
            .expect(401);
        await User.findByIdAndDelete(loggedInUser.body.id);
    });
    test("Check If validation is working(invalid content)", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const comments = await commentsInDb();
        const comment = {
            content: "",
        };
        await api
            .put(`/api/comments/${comments[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(comment)
            .expect(400);
    });
});

describe("Check if delete works", () => {
    beforeAll(async () => {
        await Comment.deleteMany({});
        const users = await usersInDb();
        const posts = await postsInDb();
        const commentObjects = helperLists.commentList
            .slice(0, 3)
            .map((comment) => {
                return new Comment({
                    user: users[0]._id,
                    post: posts[0]._id,
                    ...comment,
                });
            });
        await Comment.insertMany(commentObjects);
    });
    test("If logged in user can delete comment", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const comments = await commentsInDb();
        await api
            .delete(`/api/comments/${comments[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .expect(204);
        const commentsAfter = await commentsInDb();
        expect(commentsAfter).toHaveLength(comments.length - 1);
    });
    test("if non logged in user can delete comment", async () => {
        const comments = await commentsInDb();
        await api.delete(`/api/comments/${comments[0]._id}`).expect(401);
        const commentsAfter = await commentsInDb();
        expect(commentsAfter).toHaveLength(comments.length);
    });
    test("If a user can delete other user's comment", async () => {
        await userCreate(helperLists.userList[1]);
        const { username, password } = helperLists.userList[1];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const comments = await commentsInDb();
        await api
            .delete(`/api/comments/${comments[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .expect(401);
        const commentsAfter = await commentsInDb();
        expect(commentsAfter).toHaveLength(comments.length);
        await User.findByIdAndDelete(loggedInUser.body.id);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
