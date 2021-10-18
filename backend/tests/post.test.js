const mongoose = require("mongoose");
const helperLists = require("../utils/testDummyData");
const User = require("../models/users");
const Posts = require("../models/posts");
const Community = require("../models/communities");
const supertest = require("supertest");
const app = require("../app");
const {
    userCreate,
    postsInDb,
    usersInDb,
    communitiesInDb,
} = require("../utils/testhelper");
const Votes = require("../models/vote");
const api = supertest(app);
const loginUrl = "/api/login";
const voteUrl = "/api/posts/vote"; 


beforeAll(async () => {
    await User.deleteMany({});
    await Posts.deleteMany({});
    await Community.deleteMany({});
    const users = await userCreate(helperLists.userList[0]);
    const communityObjects = helperLists.communityList
        .slice(0, 4)
        .map((community) => {
            return {
                ...community,
                user: users._id,
            };
        });
    await Community.insertMany(communityObjects);
});

describe("Check if getting all posts work", () => {
    beforeAll(async () => {
        const users = await usersInDb();
        const communities = await communitiesInDb();
        const postObjects = helperLists.postList.slice(0, 3).map((post) => {
            return new Posts({
                user: users[0]._id,
                community: communities[0]._id,
                ...post,
            });
        });
        await Posts.insertMany(postObjects);
    });
    test("check if you can get post and status code is 200", async () => {
        await api.get("/api/posts").expect(200).expect("Content-Type", /json/);
    });
    test("check if get by id is working", async () => {
        const posts = await postsInDb();
        await api
            .get(`/api/posts/${posts[0]._id}`)
            .expect(200)
            .expect("Content-Type", /json/);
    });
    test("Check if get by invalid id gives malformatted id", async () => {
        const invalidId = "abcdefghijklomen";
        await api.get(`/api/posts/${invalidId}`).expect(400);
    });
});

describe("Check if user can make a post", () => {
    beforeAll(async () => {
        await Posts.deleteMany({});
        const users = await usersInDb();
        const communities = await communitiesInDb();
        const postObjects = helperLists.postList.slice(3, 6).map((post) => {
            return new Posts({
                user: users[0]._id,
                community: communities[0]._id,
                ...post,
            });
        });
        await Posts.insertMany(postObjects);
    });
    test("check if logged in user can make a post", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const communities = await communitiesInDb();
        const postObj = {
            ...helperLists.postList[0],
            community: communities[0]._id,
        };
        const posts = await postsInDb();
        await api
            .post("/api/posts")
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(postObj)
            .expect(201)
            .expect("Content-Type", /json/);
        const postsAfter = await postsInDb();
        expect(postsAfter).toHaveLength(posts.length + 1);
    });
    test("if post validation is working(invalid title)", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const communities = await communitiesInDb();
        const postObj = {
            title: "fail",
            content: "This might pass. ig. idk fs tho",
            community: communities[0]._id,
        };
        const posts = await postsInDb();
        await api
            .post("/api/posts")
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(postObj)
            .expect(400);
        const postsAfter = await postsInDb();
        expect(postsAfter).toHaveLength(posts.length);
    });
    test("if post validation is working(invalid content)", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const communities = await communitiesInDb();
        const postObj = {
            title: "failthis",
            content: "Thi",
            community: communities[0]._id,
        };
        const posts = await postsInDb();
        await api
            .post("/api/posts")
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(postObj)
            .expect(400);
        const postsAfter = await postsInDb();
        expect(postsAfter).toHaveLength(posts.length);
    });
    test("check if non-logged in user can make a post", async () => {
        const postObj = {
            ...helperLists.postList[0],
        };
        const posts = await postsInDb();
        await api.post("/api/posts").send(postObj).expect(401);
        const postsAfter = await postsInDb();
        expect(postsAfter).toHaveLength(posts.length);
    });
});

describe("Check if update post works", () => {
    beforeAll(async () => {
        await Posts.deleteMany({});
        const users = await usersInDb();
        const communities = await communitiesInDb();
        const postObjects = helperLists.postList.slice(0, 3).map((post) => {
            return new Posts({
                user: users[0]._id,
                community: communities[0]._id,
                ...post,
            });
        });
        await Posts.insertMany(postObjects);
    });
    test("If user can update Post", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        const post = {
            title: posts[0].title + "nothing",
            content: posts[0].content + "Something",
        };
        const response = await api
            .put(`/api/posts/${posts[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(post)
            .expect(200)
            .expect("Content-Type", /json/);
        expect(response.body.content).toBe(posts[0].content + "Something");
    });
    test("If another user can update post", async () => {
        await userCreate(helperLists.userList[1]);
        const { username, password } = helperLists.userList[1];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        const post = {
            title: posts[0].title + "nothing",
            content: posts[0].content + "Something",
        };
        await api
            .put(`/api/posts/${posts[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(post)
            .expect(401);
        await User.findByIdAndDelete(loggedInUser.body.id);
    });
    test("Check If validation is working(invalid title)", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        const post = {
            title: "pos",
            content: posts[0].content + "Something",
        };
        await api
            .put(`/api/posts/${posts[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(post)
            .expect(400);
    });
    test("Check If validation is working(invalid desc)", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        const post = {
            title: posts[0].title + "nothing",
            content: "maybe?",
        };
        await api
            .put(`/api/posts/${posts[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send(post)
            .expect(400);
    });
});

describe("Check if delete works", () => {
    beforeAll(async () => {
        await Posts.deleteMany({});
        const users = await usersInDb();
        const communities = await communitiesInDb();
        const postObjects = helperLists.postList.slice(0, 3).map((post) => {
            return new Posts({
                user: users[0]._id,
                community: communities[0]._id,
                ...post,
            });
        });
        await Posts.insertMany(postObjects);
    });
    test("If logged in user can delete post", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        await api
            .delete(`/api/posts/${posts[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .expect(204);
        const postsAfter = await postsInDb();
        expect(postsAfter).toHaveLength(posts.length - 1);
    });
    test("if non logged in user can delete post", async () => {
        const posts = await postsInDb();
        await api.delete(`/api/posts/${posts[0]._id}`).expect(401);
        const postsAfter = await postsInDb();
        expect(postsAfter).toHaveLength(posts.length);
    });
    test("if logged in but different user can delete post", async () => {
        await userCreate(helperLists.userList[1]);
        const { username, password } = helperLists.userList[1];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        await api
            .delete(`/api/posts/${posts[0]._id}`)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .expect(401);
        const postsAfter = await postsInDb();
        expect(postsAfter).toHaveLength(posts.length);
        await User.findByIdAndDelete(loggedInUser.body.id);
    });
});

describe("check if upvotes are working", () => {
    beforeAll(async () => {
        await userCreate(helperLists.userList[1]);
        await userCreate(helperLists.userList[2]);
    });
    beforeEach(async () => {
        await Posts.deleteMany({});
        await Votes.deleteMany({});
        const users = await usersInDb();
        const communities = await communitiesInDb();
        const postObjects = helperLists.postList.slice(0, 3).map((post) => {
            return new Posts({
                user: users[0]._id,
                community: communities[0]._id,
                ...post,
            });
        });
        await Posts.insertMany(postObjects);
    });
    test("if logged in users can upvote", async () => {

        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send({ vote: 1, post: posts[0]._id })
            .expect(201);
        
        const votes = await api.get(voteUrl)
            .send({post:posts[0]._id})
            .expect(200);
        const postsAfter = await postsInDb();
        expect(postsAfter[0].votes).toBe(1);
        expect(votes.body.votes).toBe(1);
        
    });

    test("if multiple logged in users can upvote", async () => {
        const logInPromiseArray = helperLists.userList
            .slice(0, 3)
            .map(async (user) => {
                return await api.post(loginUrl).send(user);
            });
        const loggedInUsers = await Promise.all(logInPromiseArray);
        const posts = await postsInDb();
        const users = loggedInUsers.map((loggedInUser) => loggedInUser.body);
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${users[0].token}`)
            .send({ vote: 1, post: posts[0]._id })
            .expect(201);
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${users[1].token}`)
            .send({ vote: -1, post: posts[0]._id })
            .expect(201);

        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${users[2].token}`)
            .send({ vote: 0, post: posts[0]._id })
            .expect(201);
        const votes = await api.get(voteUrl)
            .send({post:posts[0]._id})
            .expect(200);
        const postsAfter = await postsInDb();
        expect(votes.body.votes).toBe(0);
        expect(postsAfter[0].votes).toBe(0);
    });
    test("downvoting works", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send({ vote: -1, post: posts[0]._id })
            .expect(201);
        const votes = await api.get(voteUrl)
            .send({post:posts[0]._id})
            .expect(200);
        const postsAfter = await postsInDb();
        expect(votes.body.votes).toBe(-1);
        expect(postsAfter[0].votes).toBe(-1);
    });
    test("remove vote works", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send({ vote: 0, post: posts[0]._id })
            .expect(201);
        const votes = await api.get(voteUrl)
            .send({post:posts[0]._id})
            .expect(200);
        const postsAfter = await postsInDb();
        expect(votes.body.votes).toBe(0);
        expect(postsAfter[0].votes).toBe(0);
    });
    test("upvoting then downvoting works", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send({ vote: 1, post: posts[0]._id })
            .expect(201);
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send({ vote: -1, post: posts[0]._id })
            .expect(201);
        const votes = await api.get(voteUrl)
            .send({post:posts[0]._id})
            .expect(200);
        const postsAfter = await postsInDb();
        expect(postsAfter[0].votes).toBe(-1);
        expect(votes.body.votes).toBe(-1);
    });
    test("downvoting then upvoting works", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send({ vote: -1, post: posts[0]._id })
            .expect(201);
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send({ vote: 1, post: posts[0]._id })
            .expect(201);
        const votes = await api.get(voteUrl)
            .send({post:posts[0]._id})
            .expect(200);
        const postsAfter = await postsInDb();
        expect(postsAfter[0].votes).toBe(1);
        expect(votes.body.votes).toBe(1);
    });
    test("upvoting then removing vote works", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send({ vote: 1, post: posts[0]._id })
            .expect(201);
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send({ vote: 0, post: posts[0]._id })
            .expect(201);
        const votes = await api.get(voteUrl)
            .send({post:posts[0]._id})
            .expect(200);
        const postsAfter = await postsInDb();
        expect(postsAfter[0].votes).toBe(0);
        expect(votes.body.votes).toBe(0);
    });
    test("downvoting then removing vote works", async () => {
        const { username, password } = helperLists.userList[0];
        const loggedInUser = await api
            .post(loginUrl)
            .send({ username, password });
        const posts = await postsInDb();
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send({ vote: -1, post: posts[0]._id })
            .expect(201);
        await api
            .post(voteUrl)
            .set("Authorization", `Bearer ${loggedInUser.body.token}`)
            .send({ vote: 0, post: posts[0]._id })
            .expect(201);
        const votes = await api.get(voteUrl)
            .send({post:posts[0]._id})
            .expect(200);
        const postsAfter = await postsInDb();
        expect(postsAfter[0].votes).toBe(0);
        expect(votes.body.votes).toBe(0);
    });
});

afterAll(() => {
    mongoose.connection.close();
});
