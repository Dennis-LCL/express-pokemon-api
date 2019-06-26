const express = require("express");
const pokemonRouter = express.Router();
// Create a virtual doc / empty collection called pokemons using the pokemon model.
const mongoose = require("mongoose");
require("../models/pokemon.model");
const PokemonModel = mongoose.model("Pokemon");

pokemonRouter.post("/", async (req, res, next) => {
  try {
    // const newPokemon = flattenObj(req.body);
    const newPokemon = req.body;
    await PokemonModel.create(newPokemon);
    res.status(200).send(req.body);
  } catch (error) {
    next(error);
  }
});

module.exports = pokemonRouter;
