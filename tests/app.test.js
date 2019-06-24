const app = require("../src/app");
const request = require("supertest");

describe("Pokemon API", () => {
  it("GET / should return 'Hello World from Pokemons!'.", async () => {
    const response = await request(app).get("/");
    console.log(response.text);
    expect(response.status).toEqual(200);
    expect(response.text).toEqual("Hello World from Pokemons!");
  });
});
