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
  });

  it("POST /pokemons should return one newly created Pokemon.", async () => {
    const newPokemon = pokemonData[0];
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
    delete newPokemon._id;
    expect(insertedPokemon).toMatchObject(newPokemon);
  });

  it("POST /pokemons should return all newly created Pokemons.", async () => {
    const newPokemons = pokemonData[0];
    const response = await request(app)
      .post("/pokemons")
      .send(newPokemons)
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
  _id: "5cfe022f42b1786675d67e79",
  id: 7
};
