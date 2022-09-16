const { validate, Customer } = require("../models/customer");
const express = require("express");
const router = express.Router();



router.get("/", async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 });

    res.send(customers);
});

router.get("/:id", async (req, res) => {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
        return res.status(404).send(`Failed! Customer with Id=${req.params.id} not found`);
    }

    res.send(customer);
});

router.post("/", async (req, res) => {
    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details.map(i => i.message).join(", "));
    }

    const customer = new Customer({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    });

    try {
        await customer.validate();

        const result = await customer.save();
    }
    catch (ex) {
        return res.status(400).send("Failed to add Customer", ex);
    }

    res.status(200).send(customer);
});

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);

    if (error) {
        return res.status(400).send(error.details.map(i => i.message).join(", "));
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        phone: req.body.name,
        isGold: req.body.name
    }, { new: true });

    if (!customer) {
        return res.status(404).send(`Failed! Customer with Id=${req.params.id} not found`);
    }

    res.status(200).send(customer);
});

router.delete("/:id", async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id, { new: true });

    if (!customer) {
        return res.status(404).send(`Failed! Customer with Id=${req.params.id} not found`);
    }

    res.status(200).send(customer);
});


module.exports = router;