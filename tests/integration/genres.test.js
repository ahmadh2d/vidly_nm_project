const { default: mongoose } = require("mongoose");
const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");
let server;

describe("/api/genres", () => {
    beforeEach(() => {
        server = require("../../index");
        // server.on('error', (e) => {
        //     if (e.code === 'EADDRINUSE') {
        //       console.log('Address in use, retrying...');
        //       setTimeout(() => {
        //         server.close();
        //         server.listen(3000);
        //       }, 1000);
        //     }
        //   });
    });
    afterEach(async () => {
        await Genre.deleteMany({});
        server.close();
    });

    describe("GET /", () => {
        it("should return all genres", async () => {
            await Genre.collection.insertMany([
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
            const genre = new Genre({name: "genre1"});
            await genre.save();

            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty("name", genre.name);
        });
        
        it("should return a 404 error if genre is invalid", async () => {
            const res = await request(server).get(`/api/genres/1`);

            expect(res.status).toBe(404);
        });

        it("should return a 404 error if genre is invalid", async () => {
            const id = mongoose.Types.ObjectId();
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

        beforeEach(() => {
            const user = new User();
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
            expect(res.body).toHaveProperty("_id");
            expect(res.body).toHaveProperty("name", name);
        });
    });
});
