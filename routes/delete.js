const express = require("express");
const axios = require("axios");
require("dotenv").config();
let num = 0;
const pg = require("pg");

const router = express.Router();
let response;
const cors = require("cors");

router.use(cors());
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

router.delete("/rexipes/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const response = await pool.query("DELETE  FROM recipes WHERE IdRE = $1", [
      id,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(200).json({ message: "Recipe deleted successfully" });

    // console.log(response.rows);
  } catch (error) {
    console.error("Error fetching  recipe:", error.message);
    let obj = {
      error: "somthing habpend  ",
    };
    res.status(500).json({
      error: "Something went wrong while fetching a random recipe.",
    });
  }
});

module.exports = router;
