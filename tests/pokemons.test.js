// Setup test dependencies for Express app.
const request = require("supertest");
const app = require("../src/app");

// Setup test dependencies for MongoDB.
const { MongoClient } = require("mongodb");
const pokemonData = require("../data/pokemon.data");

describe("routes/pokemons", () => {
  // Configure MongoDB client for jest-mongodb
  let connection;
  let db;

  beforeAll(async () => {
    dbURIArray = global.__MONGO_URI__.split("/");
    dbName = dbURIArray[dbURIArray.length - 1];
    connection = await MongoClient.connect(global.__MONGO_URI__, {
      useNewUrlParser: true
    });
    db = await connection.db(dbName);
    console.log(dbName);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await connection.close();
    await db.close();
  });

  beforeEach(async () => {
    await db.dropDatabase();
    await db.collection("pokemons").insertMany(pokemonData);
  });

  it("POST /pokemons should return the newly created Pokemon.", async () => {
    const newPokemon = preciousPokemon;
    const response = await request(app)
      .post("/pokemons")
      .send(newPokemon)
      .set("Content-Type", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(newPokemon);
  });

  it("POST /pokemons should persist one newly created Pokemon in database.", async () => {
    // Request POST API to insert a new Pokemon into Pokedex database.
    const newPokemon = preciousPokemon;
    const response = await request(app)
      .post("/pokemons")
      .send(newPokemon)
      .set("Content-Type", "application/json");

    console.log("From API: ", newPokemon);
    // Validate if the new Pokemon is created in the in-memory Pokedex db by the API.
    const pokemons = db.collection("pokemons");
    const insertedPokemon = await pokemons.findOne({ id: 7 });
    console.log("From DB: ", insertedPokemon);
    expect(insertedPokemon).toMatchObject(newPokemon);
  });

  it.skip("GET /pokemons should return all Pokemons.", async () => {
    const newPokemons = pokemonData;
    const response = await request(app)
      .get("/pokemons")
      .set("Content-Type", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(newPokemons);
  });
});

const preciousPokemon = {
  name: {
    english: "Squirtle",
    japanese: "ゼニガメ",
    chinese: "杰尼龟"
  },
  base: {
    HP: 44,
    Attack: 48,
    Defence: 65,
    SpAttack: 50,
    SpDefence: 64,
    Speed: 43
  },
  type: ["Water"],
  id: 7
};
