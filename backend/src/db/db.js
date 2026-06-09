const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb://shayan_paul:shayan12@ac-qfh3viv-shard-00-00.jwl4hwf.mongodb.net:27017,ac-qfh3viv-shard-00-01.jwl4hwf.mongodb.net:27017,ac-qfh3viv-shard-00-02.jwl4hwf.mongodb.net:27017/skillswap?ssl=true&replicaSet=atlas-q95ffq-shard-0&authSource=admin&appName=SkillSwapCluster");
    console.log("MongoDB connected");
  } catch (err) {
    console.log("DB Error:", err.message);
  }
};

module.exports = connectDB;