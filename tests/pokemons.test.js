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

  it("POST /pokemons should return the newly created Pokemon.", async () => {
    const newPokemon = preciousPokemon;
    const response = await request(app)
      .post("/pokemons")
      .send(newPokemon)
      .set("Content-Type", "application/json");

    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(newPokemon);
  });

  it("POST /pokemons should persist the newly created Pokemon in database.", async () => {
    // Request POST API to insert a new Pokemon into Pokedex database.
    const newPokemon = preciousPokemon;
    const response = await request(app)
      .post("/pokemons")
      .send(newPokemon)
      .set("Content-Type", "application/json");

    // console.log("From API: ", newPokemon);
    // Validate if the new Pokemon is created in the in-memory Pokedex db by the API.
    const pokemons = db.collection("pokemons");
    const insertedPokemon = await pokemons.findOne({ id: 7 });
    // console.log("From DB: ", insertedPokemon);
    expect(insertedPokemon).toMatchObject(newPokemon);
  });

  it("GET /pokemons should return all Pokemons.", async () => {
    await insertPokemons();
    const response = await request(app).get("/pokemons");
    response.body.map(pokemon => {
      delete pokemon._id;
      delete pokemon.__v;
      return;
    });
    // console.log("From Response: ", response.body);
    // console.log("From pokemonData: ", pokemonData);
    expect(response.status).toEqual(200);
    expect(response.body).toMatchObject(pokemonData);
  });

  it("GET /pokemons should return text message when there is no Pokemon in database.", async () => {
    const response = await request(app).get("/pokemons");
    expect(response.status).toEqual(404);
    expect(response.text).toEqual("No pokemon caught yet.");
  });

  it("GET /pokemons/:id should return found Pokemon in database.", async () => {
    await insertPokemons();
    const id = pokemonData[0].id;
    const response = await request(app).get(`/pokemons/${id}`);
    response.body.map(pokemon => {
      delete pokemon._id;
      delete pokemon.__v;
      return;
    });
    expect(response.status).toEqual(200);
    expect(...response.body).toMatchObject(pokemonData[0]);
  });

  it("GET /pokemons/:id should return message if pokemon is not found.", async () => {
    const id = pokemonData[0].id;
    const response = await request(app).get(`/pokemons/${id}`);
    expect(response.status).toEqual(404);
    expect(response.text).toEqual("You haven't caught this one yet.");
  });
});

const insertPokemons = async () => {
  await request(app)
    .post("/pokemons")
    .send(pokemonData[0]);
  await request(app)
    .post("/pokemons")
    .send(pokemonData[1]);
  await request(app)
    .post("/pokemons")
    .send(pokemonData[2]);
};
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
