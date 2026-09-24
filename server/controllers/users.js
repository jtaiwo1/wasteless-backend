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

    const newUser = await User.create({
      username: data.username,
      password: hashedPassword,
    });

    res.status(201).send({ user_id: data.user_id, username: data.username });
  } catch (err) {
    res.status(401).send({ error: err.message });
  }
}

async function login(req, res) {
    try{
        const data = req.body;

        if(!data.username || !data.password){
            res.status(400).send({error: "Missing username or password"});
        }

        const user = await User.getByUsername(data.username);

        const match = await bcrypt.compare(data.password, user.password)
        if(!match) {
            res.status(401).send({error: "The password is incorrect"});
        }

        const payload = { user_id: user.user_id }
        const sendToken = (err, token) => {
            if(err){ throw new Error("Error generating token")};
            res.status(200).send({
                success: true,
                token: token,
            })
        }

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: 7200 }, sendToken);
    } catch(err) {
        res.status(404).send({error: err.message})
    }
}

module.exports = { index, getByUsername, register, login };
