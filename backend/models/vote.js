//Defining schema for upvote.

const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const voteSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User",required:true },
    post:{type: mongoose.Schema.Types.ObjectId, ref: "Posts",required:true},
    vote:{type:Number,min:-1,max:1,required:true}
});

voteSchema.plugin(uniqueValidator);
voteSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

const Votes = new mongoose.model("Votes", voteSchema);

module.exports = Votes;
