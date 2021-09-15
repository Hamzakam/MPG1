const User = require("../models/users");
const bcrypt = require("bcrypt");
const Posts = require("../models/posts");
const Community = require("../models/communities");
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

module.exports = { usersInDb, userCreate, postsInDb, communitiesInDb };
