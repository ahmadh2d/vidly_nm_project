const mongoose = require("mongoose");
const config = require("config");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user");

describe("user.generateAuthToken", () => {
    it("test 1", () => {
        const payload = { _id: new mongoose.Types.ObjectId(), isAdmin: true };
        const user = new User(payload);
        const token = user.generateAuthToken();

        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        expect(decoded).toMatchObject(payload);
    })
});