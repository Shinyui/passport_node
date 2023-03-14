const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

mongoose.connection.on("connecting", () => {
  console.log("establishing connection");
});

mongoose.connection.on("connected", () => {
  console.log("connected to mongo");
});

mongoose.connection.on("open", () => {
  console.log("connection established");
});

const connectToMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (error) {
    throw error;
  }
};

module.exports = connectToMongo;
