const logger = require("../logger");

module.exports = function(err, req, res, next) {
    logger.log("error", err.message, { metadata: err });

    res.status(500).send("Oops! Something failed");
}