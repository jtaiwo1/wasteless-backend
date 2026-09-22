const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function index(req, res) {
  try {
    const users = await User.getAll();
    res.status(200).send(users);
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
}

async function getByUsername(req, res) {
  try {
    const name = req.params.username;
    const user = await User.getByUsername(name);
    res.status(200).send(user);
  } catch (err) {
    res.status(404).send({ error: err.message });
  }
}

async function register(req, res) {
  try {
    const data = req.body;

    if (!data.username || !data.password) {
      res.status(400).send({ error: "Missing username or password" });
    }

    const existingUser = await User.getByUsername(data.username.toLowerCase());

    if (existingUser) {
      res.status(409).send({ error: "Username already taken" });
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_SALT_ROUNDS));
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const new_user = await User.create({
      username: data.username,
      password: hashedPassword,
    });

    res.status(201).send({ user_id: data.user_id, username: data.username });
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
}

module.exports = { index, getByUsername, register };
