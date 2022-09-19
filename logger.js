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
        new winston.transports.File({ filename: "logfile.log" })
    ],
});

module.exports = logger;
