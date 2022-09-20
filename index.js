require("express-async-errors");
const express = require("express");
const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
// require("./startup/db.js")(); // MongoDB
require("./startup/db_connect.js")(); // MySQL
require("./startup/config.js")();



const port = process.env.PORT || 3000;
const server = app.listen(port, () => console.log(`Listening on Port ${port}....`));

module.exports = server;