const express = require("express");
const axios = require("axios");
require("dotenv").config();
let num = 0;
const pg = require("pg");

const router = express.Router();
let response;
router.use(express.json());

const cors = require("cors");

router.use(cors());
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
router.get("/getAllfavorite", async (req, res) => {
  // console.log("ooooooooooooooooooo");

  try {
    const response = await pool.query("SELECT * FROM recipes ");
    // console.log(response.rows);
    res.json(response.rows);
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
