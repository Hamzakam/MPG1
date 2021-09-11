const User = require("../models/users");
const bcrypt = require("bcrypt");
const passwordEncrypt = async (password) => {
    return await bcrypt.hash(password, 10);
};

const usersInDb = async () => {
    return await User.find({});
};

module.exports = { usersInDb, passwordEncrypt };
