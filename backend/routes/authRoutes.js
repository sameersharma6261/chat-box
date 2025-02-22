const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const People = require("../models/People");

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;
  
  try {
    let people = await People.findOne({ email });
    if (people) return res.status(400).json({ msg: "People already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    people = new People({ name, email, password: hashedPassword });
    await people.save();

    res.status(201).json({ msg: "People registered successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const people = await People.findOne({ email });
    if (!people) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, people.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: people._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ token, people: { id: people._id, name: people.name, email: people.email } });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
