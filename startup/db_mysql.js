const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("vidly_db_mysql", "root", "1234", {
    dialect: "mysql",
    host: "localhost",
});

async function authenticate() {
    try {
        await sequelize.authenticate();
        console.log("Connection has been established successfully.");

        sequelize
            .sync()
            .then(() => console.log("All tables are synced"))
            .catch((error) => console.error("Failed! Something went wrong during sync", error));
    } catch (error) {
        console.error("Unable to connect to the database: ", error);
        await sequelize.close();
        process.exit(1);
    }
}

authenticate();

module.exports = sequelize;
