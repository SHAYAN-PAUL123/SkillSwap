const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    name:String,
    phoneno:Number,
    email:String,
    skillsTeach:String,
    skillsLearn:String,
})

const postmodel = mongoose.model("post", postSchema);

module.exports = postmodel;