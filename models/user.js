const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxLength: 50,
        trim: true
    },
    isAdmin: {
        type: Boolean,
    },
    email: {
        type: String,
        required: true,
        minlength: 8,
        maxLength: 255,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxLength: 1024,
        trim: true
    },
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"))
}

const User = mongoose.model("User", userSchema);


function validate(user) {
    const validator = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(8).max(255).required().email(),
        password: Joi.string().min(6).max(255).required(),
    });

    return validator.validate(user);
}

exports.User = User;
exports.validate = validate;