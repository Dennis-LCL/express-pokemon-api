const request = require("supertest");
const app = require("../src/app");
const pokemonData = require("../data/pokemon.data");

describe("routes/pokemons", () => {
  it("POST /pokemons should return the newly created Pokemon.", async () => {
    const newPokemon = pokemonData[0];
    console.log(newPokemon);
    const response = await request(app)
      .post("/pokemons")
      .send(newPokemon);

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(newPokemon);
  });
});
