//Defining schema for Community.

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const communitySchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 40,
        unique: true,
        uniqueCaseInsensitive: true,
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
});

communitySchema.plugin(uniqueValidator);
communitySchema.index({ name: "text" });
communitySchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Community = new mongoose.model("Community", communitySchema);

module.exports = Community;
