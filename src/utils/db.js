// Setup connection between the API app and the pokedex mongoDB.
// Since the direct connection is complicated, we use Mongoose as the easier-to-use API.

const mongoose = require("mongoose");

const mongoOptions = {
  useNewUrlParser: true
};

// Configure the dbURI in a way that auto-detect if the app is being called in test.
// If it's called in test, then there would be value in global.__MONGO_URI__,
// and the db.js will connect to the in-memory pokedex database.
// If it's NOT callsed in test, the global.__MONGO_URI__ will be null and the local
// hosted pokedex database will be connected by the db.js.
const dbURI = global.__MONGO_URI__ || "mongodb://localhost:27017/pokedex";
mongoose.connect(dbURI, mongoOptions);
const db = mongoose.connection;

// Event-listening pattern:
// If detects an error, console.log error.
// If connection is established, console.log connected.
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("connected to mongodb: ", dbURI);
});
