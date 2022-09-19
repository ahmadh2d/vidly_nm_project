const Joi = require("joi");
const { DataTypes } = require("sequelize");
const sequelize = require("../startup/db_mysql");
const genre = require("../models/genre");


const Movie = sequelize.define("movie", {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    numberInStock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 255
        }
    },
    dailyRentalStock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
            min: 0,
            max: 255
        }
    }
});

genre.Genre.hasMany(Movie);

function validate(movie) {
    const validator = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        genreId: Joi.number().required(),
        numberInStock: Joi.number(),
        dailyRentalStock: Joi.number()
    });

    return validator.validate(movie);
}

exports.Movie = Movie;
exports.validate = validate;