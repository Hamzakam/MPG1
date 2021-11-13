//Defining schema for Community.

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const {AWS_BUCKET_NAME, AWS_BUCKET_REGION} = require("../utils/config");
const communitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 40,
        unique: true,
        uniqueCaseInsensitive: true,
    },
    logo:{
        type:String,
        required:true,
        default:"community/default",
    },
    description: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 100,
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: "Must have the date when the community is created",
    },
    updated_at: {
        type: Date,
        default: Date.now,
        required: "Must have the date when the community is updated",
    },
    tags: [
        {
            type: String,
        },
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username:String,
});

communitySchema.plugin(uniqueValidator);

communitySchema.index({ name: "text" });
communitySchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        returnedObject.logo = `https://${AWS_BUCKET_NAME}.s3.${AWS_BUCKET_REGION}.amazonaws.com/${returnedObject.logo}`;
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Community = new mongoose.model("Community", communitySchema);

module.exports = Community;
