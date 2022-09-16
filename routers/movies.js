const { validate, Movie } = require("../models/movie");
const express = require("express");
const { Genre } = require("../models/genre");
const router = express.Router();



router.get("/", async (req, res) => {
    const movies = await Movie.find().sort({ name: 1 });

    res.send(movies);
});

router.get("/:id", async (req, res) => {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
        return res.status(404).send(`Failed! Movie with Id=${req.params.id} not found`);
    }

    res.send(movie);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details.map(i => i.message).join(", "));
    }

    const genre = await Genre.findById(req.body.genreId);
    if (!genre) {
        return res.status(404).send(`Failed! Genre with Id=${req.params.id} not found`);
    }

    const movie = new Movie({
        title: req.body.title,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalStock: req.body.dailyRentalStock
    });

    try {
        await movie.validate();

        const result = await movie.save();
    }
    catch (ex) {
        return res.status(400).send("Failed to add Movie", ex);
    }

    res.status(200).send(movie);
});

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);

    if (error) {
        return res.status(400).send(error.details.map(i => i.message).join(", "));
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        genre: {
            name: req.body.genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalStock: req.body.dailyRentalStock
    }, { new: true });

    if (!movie) {
        return res.status(404).send(`Failed! Movie with Id=${req.params.id} not found`);
    }

    res.status(200).send(movie);
});

router.delete("/:id", async (req, res) => {
    const movie = await Movie.findByIdAndRemove(req.params.id, { new: true });

    if (!movie) {
        return res.status(404).send(`Failed! Movie with Id=${req.params.id} not found`);
    }

    res.status(200).send(movie);
});


module.exports = router;