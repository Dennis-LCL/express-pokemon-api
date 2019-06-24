const express = require("express");
const app = express();
const pokemonRouter = require("./routes/pokemons");

app.use(express.json());
app.use("/pokemons/", pokemonRouter);

app.get("/", (req, res) => {
  res.status(200).send("Hello World from Pokemons!");
});

app.use((err, req, res, next) => {
  console.log("Error", err);
  res.sendStatus(500);
});

module.exports = app;
