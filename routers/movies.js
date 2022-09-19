const { validate, Movie } = require("../models/movie");
const { Genre } = require("../models/genre");
const express = require("express");
const router = express.Router();



router.get("/", async (req, res) => {
    const movies = await Movie.findAll({order: [["title", "ASC"]]});

    res.send(movies);
});

router.get("/:id", async (req, res) => {
    const movie = await Movie.findByPk(req.params.id);

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

    const genre = await Genre.findByPk(req.body.genreId);
    if (!genre) {
        return res.status(404).send(`Failed! Genre with Id=${req.body.genreId} not found`);
    }

    let movie; 

    try {
        movie = await Movie.create({
            title: req.body.title,
            genreId: genre.id,
            numberInStock: req.body.numberInStock,
            dailyRentalStock: req.body.dailyRentalStock
        });

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

    const genre = await Genre.findByPk(req.body.genreId);
    if (!genre) {
        return res.status(404).send(`Failed! Genre with Id=${req.body.genreId} not found`);
    }

    const [movie] = await Movie.update(
    {
        title: req.body.title,
        genreId: req.body.genreId,
        numberInStock: req.body.numberInStock,
        dailyRentalStock: req.body.dailyRentalStock
    },
    {
        where: {id: req.params.id}
    });

    if (!movie) {
        return res.status(404).send(`Failed! Movie with Id=${req.params.id} not found`);
    }

    res.status(200).send(movie + " row updated successfully");
});

router.delete("/:id", async (req, res) => {
    const movie = await Movie.findByPk(req.params.id);
    
    if (!movie) {
        return res.status(404).send(`Failed! Movie with Id=${req.params.id} not found`);
    }

    await movie.destroy();

    res.status(200).send(movie);
});


module.exports = router;