const express = require("express");
const axios = require("axios");
require("dotenv").config();
let num = 0;
const pg = require("pg");

const router = express.Router();
router.use(express.json());

let response;
const cors = require("cors");

router.use(cors());
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

router.post("/recipes/insert", async (req, res) => {
  const { title, image, instructions, ingredients, readyln, id } = req.body;
  console.log(req.body);
  try {
    const result = await pool.query(
      "insert into recipes (title,image,instructions,ingredients,readyln,IdRE)values($1,$2,$3,$4,$5,$6) RETURNING *",
      [title, image, instructions, JSON.stringify(ingredients), readyln, id]
    );
    res.json(result.rows[0]);
    console.log(result.rows[0]);
  } catch (err) {
    res.status(500).send("Error" + err);
  }
});
module.exports = router;
