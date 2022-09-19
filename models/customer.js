const Joi = require("joi");
const { DataTypes } = require("sequelize");
const sequelize = require("../startup/db_mysql");

const Customer = sequelize.define("Customer", {
    name: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
            len: [3, 255]
        }
    },
    isGold: {
        type: DataTypes.BOOLEAN,
    },
    phone: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
            len: [5, 20]
        }
    }
});

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