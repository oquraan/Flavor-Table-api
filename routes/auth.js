require("dotenv").config();
const express = require("express");
const router = express.Router();
const pg = require("pg");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const routeGuard = require("../middleware/verifyToken");

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

router.post("/auth/register", async (req, res) => {
  const { password, username, email } = req.body;

  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      " INSERT INTO users (username,password,email) Values ($1,$2,$3) RETURNING id,username,email,password",
      [username, hashedpassword, email]
    );

    res.status(201).json(result.rows[0]);
    // res.json(result.rows[0]);
  } catch (error) {
    console.error("");
    console.log("errore register route " + error);

    if (error.code === "23505") {
      res.status(409).json("username or Email already exist :");
    }

    res.status(500).send("Error ", error.message);
  }
});

router.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await pool.query("SELECT * from users where username=$1", [
      username,
    ]);

    const user = result.rows[0];

    if (!user) return res.status(404).send("User not found ");

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) return res.status(401).send("Invalid Credentials ");

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.APISECRET,
      { expiresIn: "2h" }
    );

    res.json({ token });
  } catch (error) {
    console.log("Error loggin  ", error);

    res.status(500).send("Error ", error.message);
  }
});

router.get("/secret", routeGuard, async (req, res) => {
  res.send("Hello, this is a protected route");
});

router.get("/users/profile", routeGuard, async (req, res) => {
  const username = req.body.username;
  try {
    const result = await pool.query(
      "SELECT email,username FROM users where username=$1",
      [username]
    );

    const user = result.rows[0];

    if (!user) return res.status(404).send("User not found ");

    res.json(result.rows[0]);
  } catch (error) {
    console.log("err   " + error);
    res.status(500).json("ERRORE  :");
  }
});

router.put("/users/profile", routeGuard, async (req, res) => {
  const { email, username } = req.body;

  try {
    const result = await pool.query(
      "UPDATE  users SET   email=$1 where username=$2  RETURNING *",
      [email, username]
    );

    const user = result.rows[0];

    if (!user) return res.status(404).send("User not found ");

    res.json(result.rows[0]);
  } catch (error) {
    console.log("err   " + error);
    res.status(500).json("ERRORE  :");
  }
});

router.put("/users/password", routeGuard, async (req, res) => {
  const { password, username } = req.body;

  const hashedpassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      "UPDATE  users SET   password=$1 where username=$2  RETURNING *",
      [hashedpassword, username]
    );

    const user = result.rows[0];

    if (!user) return res.status(404).send("User not found ");
    res.status(201).json(result.rows[0]);
    // res.json(result.rows[0]);
  } catch (error) {
    console.error("");
    console.log("errore register route " + error);

    if (error.code === "23505") {
      res.status(409).json("username or Email already exist :");
    }

    res.status(500).send("Error ", error.message);
  }
});

module.exports = router;
