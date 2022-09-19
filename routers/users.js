const { validate, User } = require("../models/user");
const auth = require("../middleware/auth");
const _ = require("lodash");
const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

// Register User
router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details.map(i => i.message).join(", "));
    }

    const existingUser = await User.findOne({ where: { email: req.body.email }});
    if (existingUser)
        return res.status(400).send("User with given email already exist");

    const salt = await bcrypt.genSalt(10);
    
    let user;
    
    try {
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt)
        });
    }
    catch (ex) {
        return res.status(400).send("Failed to create a User", ex);
    }

    const token = user.generateAuthToken();

    res.header("x-auth-token", token).status(200).send(_.pick(req.body, ["name", "email", "id"]));
});

router.get("/me", auth, async (req, res) => {
    const user = await User.findByPk(req.user.id, {attributes: ["name", "email", "isAdmin"]});

    res.status(200).send(user);
});

router.get("/", async (req, res) => {
    const users = await User.findAll({order: [["name", "ASC"]]});

    res.send(users);
});

router.get("/:id", async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        return res.status(404).send(`Failed! User with Id=${req.params.id} not found`);
    }

    res.send(user);
});

// router.put("/:id", async (req, res) => {
//     const { error } = validate(req.body);

//     if (error) {
//         return res.status(400).send(error.details.map(i => i.message).join(", "));
//     }

//     const user = await User.findByIdAndUpdate(req.params.id, {
//         name: req.body.name,
//         email: req.body.email,
//         password: req.body.password
//     }, { new: true });

//     if (!user) {
//         return res.status(404).send(`Failed! User with Id=${req.params.id} not found`);
//     }

//     res.status(200).send(user);
// });

router.delete("/:id", async (req, res) => {
    const user = await User.findByPk(req.params.id);

    if (!user) {
        return res.status(404).send(`Failed! User with Id=${req.params.id} not found`);
    }

    user.destroy();
    res.status(200).send(user);
});


module.exports = router;