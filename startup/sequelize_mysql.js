const { Sequelize } = require("sequelize");
const config = require("config")

const sequelize = new Sequelize(config.get("db"), "root", "1234", {
    dialect: "mysql",
    host: "localhost",
});

module.exports = sequelize;
