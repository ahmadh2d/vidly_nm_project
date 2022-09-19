const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
let server;

describe("auth middleware", () => {
    let token;

    beforeEach(() => {
          
        const user = new User();
        token = user.generateAuthToken();
    });
    
    afterEach(async () => {
        await Genre.deleteMany({});
        server.close();
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