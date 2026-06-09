const express = require("express");
const cors = require("cors");
const app = express();
const postModel = require("./models/post.models");

app.use(cors());
app.use(express.json());

app.post('/getinfo', async (req, res) => {
        const post = await postModel.create({
            name: req.body.name,
            phoneno: req.body.phoneno,
            email: req.body.email,
            skillsTeach: req.body.skillsTeach,
            skillsLearn: req.body.skillsLearn
        });

        return res.status(201).json({
            message: "ho gya",
            post
        });
});

app.get('/getinfo', async (req, res) => {
    const posts = await postModel.find();
    return res.status(200).json({
        message: "mil gya",
        posts
    });
}
)

module.exports = app;