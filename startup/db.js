const mongoose = require("mongoose");

module.exports = function () {
    // MongoDB
    mongoose
        .connect("mongodb://localhost/vidly")
        .then(() => console.log("Connected to MongoDB..."))
        .catch((err) =>
            console.log("Failed to connect to MongoDB...", err.Message)
        );
};
