const mongoose = require("mongoose");
const config = require("config");

module.exports = async function () {
    // MongoDB
    const db = config.get("db");
    await mongoose
        .connect(db)
        .then(() => console.log(`Connected to ${db} DB...`))
        .catch((err) =>
            console.log(`Failed to connect to '${db}' MongoDB...`, err.Message)
        );
};
