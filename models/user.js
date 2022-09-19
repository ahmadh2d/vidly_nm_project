const Joi = require("joi");
const config = require("config");
const jwt = require("jsonwebtoken");
const { DataTypes } = require("sequelize");
const sequelize = require("../startup/db_mysql");

const userSchema = {
    id: {
        type: DataTypes.INTEGER(11),
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
            len: [5, 50]
        }
    },
    isAdmin: {
        type: DataTypes.BOOLEAN,
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        validate: {
            len: [8, 255],
        }
    },
    password: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        validate: {
            len: [6, 1024],
        }
    },
};


const User = sequelize.define("User", userSchema);

User.prototype.generateAuthToken = function () {
    return jwt.sign({ id: this.id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"))
}

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