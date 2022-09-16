const logger = require("../logger");

module.exports = function() {
    process.on("uncaughtException", (ex) => {
        logger.error("Got an uncaught exception", { metadata: ex });
    });
    
    process.on("unhandledRejection", (ex) => {
        throw ex;
    });
    
}