require("dotenv").config();

const mongoURI = (environment) => {
    if (environment === "prod") {
        return process.env.MONGODB_URI;
    } else if (environment === "test") {
        return process.env.TEST_MONGODB_URI;
    }
    return process.env.DEV_MONGODB_URI;
};

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: mongoURI(process.env.NODE_ENV),
    SECRET: process.env.SECRET,
};
