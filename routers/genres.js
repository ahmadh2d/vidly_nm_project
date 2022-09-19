const { validate, Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const isAdmin = require("../middleware/admin");
const express = require("express");
const router = express.Router();
// const asyncMiddleware = require("../middleware/async")
// const validatingObjectId = require("../middleware/validatingObjectId");

/*
router.get("/", asyncMiddleware(async (req, res, next) => {
    const genres = await Genre.find().sort({ name: 1 });

    res.send(genres);
}));
*/

router.get("/", async (req, res, next) => {
    const genres = await Genre.findAll({order: [['name', 'ASC']]});

    res.send(genres);
});

router.get("/:id", async (req, res) => {
    const genre = await Genre.findByPk(req.params.id);

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

    let genre;
    try {
        genre = await Genre.create({
            name: req.body.name,
        });
    } catch (error) {
        return res.status(400).send("Failed to add Genre", error);
    }

    res.status(200).send(genre);
});

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const [ genre ] = await Genre.update(
        {
            name: req.body.name
        },
        {
            where: { id: req.params.id }
        },
    );

    if (!genre) {
        return res
            .status(404)
            .send(`Failed! Genre with Id=${req.params.id} not found`);
    }

    res.status(200).send(genre + " row updated successfully");
});

router.delete("/:id", [auth, isAdmin], async (req, res) => {
    const genre = await Genre.findByPk(req.params.id);

    if (!genre) {
        return res
            .status(404)
            .send(`Failed! Genre with Id=${req.params.id} not found`);
    }

    await genre.destroy();

    res.status(200).send(genre);
});

module.exports = router;
