const { validate, Customer } = require("../models/customer");
const express = require("express");
const router = express.Router();



router.get("/", async (req, res) => {
    const customers = await Customer.findAll({order: [['name', 'ASC']]});

    res.send(customers);
});

router.get("/:id", async (req, res) => {
    const customer = await Customer.findByPk(req.params.id);

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
    
    let customer;
    try {
        customer = await Customer.create({
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        });
    } catch (error) {
        return res.status(400).send("Failed to add Customer", error);
    }

    res.status(200).send(customer);
});

router.put("/:id", async (req, res) => {
    const { error } = validate(req.body);

    if (error) {
        return res.status(400).send(error.details.map(i => i.message).join(", "));
    }

    let numCustomerChanged;
    try {
        [numCustomerChanged] = await Customer.update(
            {
                name: req.body.name,
                phone: req.body.phone,
                isGold: req.body.isGold,
            },
            { where: { id: req.params.id } }
        );
    } catch (error) {
        return res.status(400).send("Failed to update Customer", error.message);
    }

    if (!numCustomerChanged) {
        return res.status(404).send(`Failed! Customer with Id=${req.params.id} not found`);
    }

    res.status(200).send(numCustomerChanged + " row updated successfully");
});

router.delete("/:id", async (req, res) => {
    const customer = await Customer.findByPk(req.params.id);

    if (!customer) {
        return res.status(404).send(`Failed! Customer with Id=${req.params.id} not found`);
    }

    await customer.destroy();
    res.status(200).send(customer);
});


module.exports = router;