const { validate, Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
// const asyncMiddleware = require("../middleware/async")
const validatingObjectId = require("../middleware/validatingObjectId");
const express = require("express");
const { default: mongoose } = require("mongoose");
const router = express.Router();

/*
router.get("/", asyncMiddleware(async (req, res, next) => {
    const genres = await Genre.find().sort({ name: 1 });

    res.send(genres);
}));
*/

router.get("/", async (req, res, next) => {
    const genres = await Genre.find().sort({ name: 1 });

    res.send(genres);
});

router.get("/:id", validatingObjectId, async (req, res) => {
    const genre = await Genre.findById(req.params.id);

    if (!genre) {
        return res
            .status(404)
            .send(`Failed! Genre with Id=${req.params.id} not found`);
    }

    res.status(200).send(genre);
});

router.post("/", auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const genre = new Genre({
        name: req.body.name,
    });

    try {
        await genre.validate();

        const result = await genre.save();
    } catch (ex) {
        return res.status(400).send("Failed to add Genre", ex);
    }

    res.status(200).send(genre);
});

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const genre = await Genre.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
        },
        { new: true }
    );

    if (!genre) {
        return res
            .status(404)
            .send(`Failed! Genre with Id=${req.params.id} not found`);
    }

    res.status(200).send(genre);
});

router.delete("/:id", [auth, isAdmin], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id, { new: true });

    if (!genre) {
        return res
            .status(404)
            .send(`Failed! Genre with Id=${req.params.id} not found`);
    }

    res.status(200).send(genre);
});

module.exports = router;
