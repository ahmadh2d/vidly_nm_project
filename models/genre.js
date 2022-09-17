const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxLength: 50
    }
});

const Genre = mongoose.model("Genre", genreSchema);

function validate(genre) {
    const validator = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });

    return validator.validate(genre);
}

exports.Genre = Genre;
exports.validate = validate;
exports.schema = genreSchema;