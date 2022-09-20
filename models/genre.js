const Joi = require("joi");
const { DataTypes } = require("sequelize");
const sequelize = require("../startup/sequelize_mysql");

const genreSchema = {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false
    },

};

const Genre = sequelize.define("genre", genreSchema);

function validate(genre) {
    const validator = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });

    return validator.validate(genre);
}

exports.Genre = Genre;
exports.validate = validate;
exports.schema = genreSchema;