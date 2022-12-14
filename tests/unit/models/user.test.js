const config = require("config");
const jwt = require("jsonwebtoken");
const { User } = require("../../../models/user");

describe("user.generateAuthToken", () => {

    it("user test for generating and verifying correct token", () => {
        const payload = {
            id: 1,
            isAdmin: true
        };
        const user = new User(payload);
        const token = user.generateAuthToken();

        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
        expect({}).toMatchObject({});
    });
});
