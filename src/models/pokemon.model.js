// Use Mongoose to create the pokemon schema
// Then use the schema to create pokemon model
// Model here is acting like a virtual document/collection
// Once the model is created, we use the model to perform CRUD operations.

const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Schema = mongoose.Schema;

// Create the schema
const pokemonSchema = Schema({
  id: { type: Number, unique: true, required: true },
  name: {
    english: { type: String, required: true },
    japanese: { type: String, required: false },
    chinese: { type: String, required: false }
  },
  type: { type: [String], required: true },
  base: {
    HP: { type: Number, required: true },
    Attack: { type: Number, required: true },
    Defence: { type: Number, required: true },
    SpAttack: { type: Number, required: true },
    SpDefence: { type: Number, required: true },
    Speed: { type: Number, required: true }
  }
});

// Create the model. Notice that we do NOT need to export the model.
mongoose.model("Pokemon", pokemonSchema);
