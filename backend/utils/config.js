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
    AWS_BUCKET_REGION:process.env.AWS_BUCKET_REGION,
    AWS_ACCESS_KEY:process.env.AWS_ACCESS_KEY,
    AWS_SECRET_KEY:process.env.AWS_SECRET_KEY,
    AWS_BUCKET_NAME:process.env.AWS_BUCKET_NAME
};
