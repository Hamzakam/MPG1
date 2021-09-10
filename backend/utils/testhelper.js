const User = require("../models/users");

const usersInDb = async () => {
    return await User.find({});
};

module.exports = { usersInDb };
