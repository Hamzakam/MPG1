const User = require("../models/users");
const bcrypt = require("bcrypt");
const Posts = require("../models/posts");
const Community = require("../models/communities");
const Comment = require("../models/comments");
const Reply = require("../models/replies");
const passwordEncrypt = async (password) => {
    return await bcrypt.hash(password, 10);
};

const usersInDb = async () => {
    return await User.find({});
};
const communitiesInDb = async () => {
    return await Community.find({});
};
const postsInDb = async () => {
    return await Posts.find({});
};

const commentsInDb = async () => {
    return await Comment.find({});
};
const repliesInDb = async () => {
    return await Reply.find({});
};

const userCreate = async ({ username, password, email }) => {
    const passwordHash = await passwordEncrypt(password);
    const user = new User({
        username,
        email,
        passwordHash,
    });
    const savedUser = await user.save();
    return savedUser;
};

module.exports = {
    usersInDb,
    userCreate,
    postsInDb,
    communitiesInDb,
    commentsInDb,
    repliesInDb,
};
