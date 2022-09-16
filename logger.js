const winston = require("winston");
require("winston-mongodb");

const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.prettyPrint()
            ),
        }),
        new winston.transports.File({ filename: "logfile.log" }),
        new winston.transports.MongoDB({
            db: "mongodb://localhost/vidly",
            level: "error",
        }),
    ],
});

module.exports = logger;
