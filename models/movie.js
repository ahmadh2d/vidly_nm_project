const Joi = require("joi");
const { default: mongoose } = require("mongoose");
const genre = require("../models/genre");

const Movie = mongoose.model("Movie", new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxLength: 255,
        trim: true
    },
    genre: {
        type: genre.schema,
        required: true
    },
    numberInStock: {
        type: Number,
        default: 0,
        min: 0,
        max: 255
    },
    dailyRentalStock: {
        type: Number,
        default: 0,
        min: 0,
        max: 255
    }
}));

function validate(movie) {
    const validator = Joi.object({
        title: Joi.string().min(3).max(255).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number(),
        dailyRentalStock: Joi.number()
    });

    return validator.validate(movie);
}

exports.Movie = Movie;
exports.validate = validate;