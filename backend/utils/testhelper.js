const User = require("../models/users");
const bcrypt = require("bcrypt");
const Posts = require("../models/posts");
const passwordEncrypt = async (password) => {
    return await bcrypt.hash(password, 10);
};

const usersInDb = async () => {
    return await User.find({});
};

const postsInDb = async () => {
    return await Posts.find({});
};

module.exports = { usersInDb, passwordEncrypt, postsInDb };
