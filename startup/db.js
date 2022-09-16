const mongoose = require("mongoose");
const config = require("config");

module.exports = function () {
    // MongoDB
    const db = config.get("db");
    mongoose
        .connect(db)
        .then(() => console.log(`Connected to ${db} DB...`))
        .catch((err) =>
            console.log(`Failed to connect to '${db}' MongoDB...`, err.Message);
        );
};
