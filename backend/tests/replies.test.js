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
    repliesInDb,
} = require("../utils/testhelper");
const Reply = require("../models/replies");
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
    const posts = await Posts.insertMany(postObjects);
    const commentObjects = helperLists.commentList
        .slice(0, 3)
        .map((comment) => {
            return new Comment({
                user: user._id,
                post: posts[0]._id,
                ...comment,
            });
        });
    await Comment.insertMany(commentObjects);
});

describe("Check if user can make replies", () => {
    beforeAll(async () => {
        await Reply.deleteMany({});
        const users = await usersInDb();
        const posts = await postsInDb();
        const comments = await commentsInDb();
        const replyObjects = helperLists.replyList.slice(0, 3).map((reply) => {
            return new Reply({
                ...reply,
                comment: comments[0].id,
                user: users[0].id,
                post: posts[0].id,
            });
        });
        await Reply.insertMany(replyObjects);
    });

    test("check if a logged in user can make a reply", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const comments = await commentsInDb();

        const replyObj = {
            ...helperLists.replyList[4],
            comment: comments[0]._id,
            post: comments[0].post,
        };
        const replies = await repliesInDb();
        await api
            .post("/api/comments/r")
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(replyObj)
            .expect(201)
            .expect("Content-Type", /json/);
        const repliesAfter = await repliesInDb();
        expect(repliesAfter).toHaveLength(replies.length + 1);
    });

    test("check if user(not comment-creator) can make a reply", async () => {
        await userCreate(helperLists.userList[1]);
        const { username, password } = helperLists.userList[1];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const comments = await commentsInDb();

        const replyObj = {
            ...helperLists.replyList[4],
            comment: comments[0]._id,
            post: comments[0].post,
        };
        const replies = await repliesInDb();
        await api
            .post("/api/comments/r")
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(replyObj)
            .expect(201)
            .expect("Content-Type", /json/);
        const repliesAfter = await repliesInDb();
        expect(repliesAfter).toHaveLength(replies.length + 1);
        await User.findByIdAndDelete(loggedInUser.body.id);
    });

    test("if reply validation is working(invalid content)", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const comments = await commentsInDb();
        const commentObj = {
            content: "",
            comment: comments[0]._id,
            post: comments[0].post,
        };
        const replies = await repliesInDb();

        await api
            .post("/api/comments/r")
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(commentObj)
            .expect(400)
            .expect("Content-Type", /json/);
        const repliesAfter = await repliesInDb();
        expect(repliesAfter).toHaveLength(replies.length);
    });

    test("check if non-logged in user can make a post", async () => {
        const comments = await commentsInDb();
        const replyObj = {
            content: "",
            comment: comments[0]._id,
            post: comments[0].post,
        };
        const replies = await repliesInDb();
        await api.post("/api/comments/r").send(replyObj).expect(401);
        const repliesAfter = await repliesInDb();
        expect(repliesAfter).toHaveLength(replies.length);
    });
});

describe("Check if update reply works", () => {
    beforeAll(async () => {
        await Reply.deleteMany({});
        const users = await usersInDb();
        const posts = await postsInDb();
        const comments = await commentsInDb();
        const replyObjects = helperLists.replyList.slice(0, 3).map((reply) => {
            return new Reply({
                ...reply,
                comment: comments[0].id,
                user: users[0].id,
                post: posts[0].id,
            });
        });
        await Reply.insertMany(replyObjects);
    });
    test("If user can update reply", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const replies = await repliesInDb();
        const replyObj = {
            content: replies[0].content + "Something",
        };
        const response = await api
            .put(`/api/comments/r/${replies[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(replyObj)
            .expect(200)
            .expect("Content-Type", /json/);
        expect(response.body.content).toBe(replies[0].content + "Something");
    });
    test("If a user can update another user's reply", async () => {
        await userCreate(helperLists.userList[1]);
        const { username, password } = helperLists.userList[1];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const replies = await repliesInDb();
        const replyObj = {
            content: replies[0].content + "Something",
        };
        await api
            .put(`/api/comments/r/${replies[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(replyObj)
            .expect(401);
        await User.findByIdAndDelete(loggedInUser.body.id);
    });
    test("Check If validation is working(invalid content)", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const replies = await repliesInDb();
        const replyObj = {
            content: "",
        };
        await api
            .put(`/api/comments/r/${replies[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(replyObj)
            .expect(400);
    });
});

describe("Check if delete works", () => {
    beforeAll(async () => {
        await Reply.deleteMany({});
        const users = await usersInDb();
        const posts = await postsInDb();
        const comments = await commentsInDb();
        const replyObjects = helperLists.replyList.slice(0, 3).map((reply) => {
            return new Reply({
                ...reply,
                comment: comments[0].id,
                user: users[0].id,
                post: posts[0].id,
            });
        });
        await Reply.insertMany(replyObjects);
    });
    test("If logged in user can delete reply", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const replies = await repliesInDb();
        await api
            .delete(`/api/comments/r/${replies[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .expect(204);
        const repliesAfter = await repliesInDb();
        expect(repliesAfter).toHaveLength(replies.length - 1);
    });
    test("if non logged in user can delete reply", async () => {
        const replies = await repliesInDb();
        await api.delete(`/api/comments/r/${replies[0]._id}`).expect(401);
        const repliesAfter = await repliesInDb();
        expect(repliesAfter).toHaveLength(replies.length);
    });
    test("If a user can delete other user's reply", async () => {
        await userCreate(helperLists.userList[1]);
        const { username, password } = helperLists.userList[1];
        const loggedInUser = await api
            .post("/api/login")
            .send({ username, password });
        const replies = await repliesInDb();
        await api
            .delete(`/api/comments/r/${replies[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .expect(401);
        const repliesAfter = await repliesInDb();
        expect(repliesAfter).toHaveLength(replies.length);
        await User.findByIdAndDelete(loggedInUser.body.id);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
