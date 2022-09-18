const { User } = require("../../../models/user");
const mongoose = require("mongoose");
const auth = require("../../../middleware/auth");

describe("auth middleware", () => {
    it("should populate req.user with payload of a valid JWT", () => {
        const user = { _id: new mongoose.Types.ObjectId(), isAdmin: true };
        const token = new User(user).generateAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(token)
        };

        const res = {};
        const next = jest.fn();

        auth(req, res, next);

        expect(req.user).toBeDefined();
    });
});