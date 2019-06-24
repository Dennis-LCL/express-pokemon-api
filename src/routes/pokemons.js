const express = require("express");
const pokemonRouter = express.Router();

pokemonRouter.post("/", (req, res) => {
  res.status(200).send(req.body);
});

module.exports = pokemonRouter;
