const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
const sequelize = require("../../startup/sequelize_mysql");
let server;

describe("/api/genres", () => {
    beforeAll(async () => {
        // await sequelize.sync({ force: true });
    });

    beforeEach(() => {
        server = require("../../index");
    });
    afterEach(async () => {
        await Genre.truncate();
        server.close();
    });

    afterAll(async () => {
        await sequelize.close()
    })

    describe("GET /", () => {
        it("should return all genres", async () => {
            await Genre.bulkCreate([
                { name: "genre1" },
                { name: "genre2" },
            ]);

            const res = await request(server).get("/api/genres");
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some((i) => i.name === "genre1")).toBeTruthy();
            expect(res.body.some((i) => i.name === "genre2")).toBeTruthy();

        });
    });

    describe("GET /:id", () => {
        it("should return a genre by id", async () => {
            const genre = await Genre.create({name: "genre1"});

            const res = await request(server).get(`/api/genres/${genre.id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", genre.name);
        });
        
        it("should return a 404 error if genre is invalid", async () => {
            const res = await request(server).get(`/api/genres/1`);

            expect(res.status).toBe(404);
        });

        it("should return a 404 error if genre is invalid", async () => {
            const id = 1;
            const res = await request(server).get(`/api/genres/${id}`);

            expect(res.status).toBe(404);
        });
    });

    describe("POST /", () => {
        const exec = async () => {
            return await request(server).post("/api/genres")
            .set("x-auth-token", token)
            .send({
                name
            });
        }

        let token;
        let name;

        beforeEach(async () => {
            const user = new User({
                name: "ahmad",
                email: "ahmad@gmail.com",
                password: "123456"
            });
            token = user.generateAuthToken();
            name = "thriller";
        });


        it("should return a 401 error for unauthorized user", async () => {
            token = "";
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it("should return a 400 error for characters length less than 3", async () => {
            name = "12"
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should return a 400 error for characters length greater than 50", async () => {
            name = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400);
        });

        it("should return not null if data is valid", async () => {
            const res = await exec();

            expect(res.body).not.toBeNull();
        });
        
        it("should return a genre object if data is valid", async () => {
            const res = await exec()

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("id");
            expect(res.body).toHaveProperty("name", name);
        });
    });
});
