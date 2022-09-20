const sequelize = require("./sequelize_mysql");

module.exports = async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        sequelize
            .sync()
            .then(() => console.log("All tables are synced"))
            .catch((error) => console.error("Failed! Something went wrong during sync", error));
    } catch (error) {
        console.error("Unable to connect to the database: ", error);
        // await sequelize.close();
        // process.exit(1);
    }
}