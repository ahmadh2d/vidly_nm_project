const { User } = require("../models/user");
const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const router = express.Router();

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details.map(i => i.message).join(", "));
    }

    const user = await User.findOne({ where: { email: req.body.email }});
    if (!user)
        return res.status(400).send("Invalid email or password");

    const passwordValid = await bcrypt.compare(req.body.password, user.password);
    if (!passwordValid)
        return res.status(400).send("Invalid email or password");

    const token = user.generateAuthToken();

    res.status(200).send(token);
});

function validate(user) {
    const validator = Joi.object({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
    });

    return validator.validate(user);
}

module.exports = router;