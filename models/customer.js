const Joi = require("joi");
const { default: mongoose } = require("mongoose");

const Customer = mongoose.model("Customer", new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxLength: 255
    },
    isGold: {
        type: Boolean,
    },
    phone: {
        type: String,
        minlength: 5,
        maxLength: 20,
        required: true
    }
}));

function validate(customer) {
    const validator = Joi.object({
        name: Joi.string().min(3).required(),
        isGold: Joi.bool(),
        phone: Joi.string().min(3).max(20).required()
    });

    return validator.validate(customer);
}

exports.Customer = Customer;
exports.validate = validate;