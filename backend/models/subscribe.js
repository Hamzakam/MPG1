//Defining schema for view.

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const subSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
});

subSchema.plugin(uniqueValidator);
subSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Subscribe = new mongoose.model("Subscribe", subSchema);

module.exports = Subscribe;
