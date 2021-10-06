//Defining schema for view.

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const viewSchema = mongoose.Schema({
    users: [
        {
            userid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            first_viewed: {
                type: Date,
                default: Date.now,
                required: "Must have the date when the post was first seen",
            },
            last_viewed: {
                type: Date,
                default: Date.now,
                required: "Must have the date when the post was last seen",
            },
        },
    ],
});

viewSchema.plugin(uniqueValidator);
viewSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Views = new mongoose.model("Views", viewSchema);

module.exports = Views;
