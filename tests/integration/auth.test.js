const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const sequelize = require("../../startup/db_mysql");
let server;

describe("auth middleware", () => {
    let token;

    // beforeAll(async () => {
    //     await sequelize.sync({ force: true });
    // });

    beforeEach(async () => {
        server = require("../../index");
        const user = new User();
        token = user.generateAuthToken();
    });
    
    afterEach(async () => {
        await Genre.truncate();
        server.close();
    });

    afterAll(async () => {
        await sequelize.close()
    });
    
    
    const exec = () => {
        return request(server).post("/api/genres")
            .set("x-auth-token", token)
            .send({
                name: "genre1"
            });
    }
    
    it("should return 401 when no token is supplied", async () => {
        token = "";

        const res = await exec();
        expect(res.status).toBe(401);
    });

    it("should return 400 when wrong token is supplied", async () => {
        token = "a";

        const res = await exec();
        expect(res.status).toBe(400);
    });
    
    it("should return 200 when right token is supplied", async () => {
        
        const res = await exec();
        expect(res.status).toBe(200);
    });
})