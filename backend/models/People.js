const mongoose = require("mongoose");

const PeopleSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

module.exports = mongoose.model("People", PeopleSchema);
