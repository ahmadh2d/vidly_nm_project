const express = require("express");
const genres = require("../routers/genres");
const customers = require("../routers/customer");
const movies = require("../routers/movies");
const users = require("../routers/users");
const auth = require("../routers/auth");
const error = require("../middleware/error");


module.exports = (app) => {
    // Middleware
    app.use(express.json());
    app.use("/api/genres", genres);
    app.use("/api/customers", customers);
    app.use("/api/movies", movies);
    app.use("/api/users", users);
    app.use("/api/auth", auth);
    
    // custom exception/error handling
    app.use(error);
}