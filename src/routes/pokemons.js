const express = require("express");
const pokemonRouter = express.Router();
// Create a virtual doc / empty collection called pokemons using the pokemon model.
const mongoose = require("mongoose");
require("../models/pokemon.model");
const PokemonModel = mongoose.model("Pokemon");

// Database CRUD functions
const findOnePokemon = async pokemonId => {
  const foundPokemon = await PokemonModel.find(
    { id: pokemonId },
    (err, pokemon) => {}
  );
  isPokemonFound = foundPokemon.length !== 0 ? true : false;
  if (isPokemonFound) {
    return foundPokemon;
  } else {
    throw new Error("You haven't caught this one yet.");
  }
};

// Router Middleware
pokemonRouter.post("/", async (req, res, next) => {
  try {
    const newPokemon = req.body;
    await PokemonModel.create(newPokemon);
    res.status(200).send(req.body);
  } catch (error) {
    next(error);
  }
});

pokemonRouter.get("/", async (req, res, next) => {
  const foundPokemons = await PokemonModel.find();
  isPokemonFound = foundPokemons.length !== 0 ? true : false;
  return isPokemonFound
    ? res.status(200).send(foundPokemons)
    : res.status(404).send("No pokemon caught yet.");
});

pokemonRouter.get("/:id", async (req, res, next) => {
  pokemonId = Number(req.params.id);
  try {
    const foundPokemon = await findOnePokemon(pokemonId);
    res.status(200).send(foundPokemon);
  } catch (err) {
    next(err);
  }
});

pokemonRouter.put("/:id", async (req, res, next) => {
  pokemonId = Number(req.params.id);
  pokemonData = req.body;
  try {
    await PokemonModel.findOneAndUpdate(
      { id: pokemonId },
      pokemonData,
      (err, pokemon) => {}
    );
    const updatedPokemon = await findOnePokemon(pokemonId);
    res.status(200).send(updatedPokemon);
  } catch (err) {
    next(err);
  }
});

pokemonRouter.delete("/:id", async (req, res, next) => {
  pokemonId = Number(req.params.id);
  pokemonData = req.body;
  try {
    await PokemonModel.findOneAndRemove(
      { id: pokemonId },
      (err, pokemon) => {}
    );
    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
});

pokemonRouter.use((err, req, res, next) => {
  res.status(404).send(err.message);
});

module.exports = pokemonRouter;
