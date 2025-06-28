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

router.get("/check/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const response = await pool.query(
      "SELECT * FROM recipes WHERE IdRE = $1",
      [id]
    );
    // console.log(response.rows);
    if (response.rows.length > 0) {
      res.json({ stu: true });
      console.log("1ssssssss");
    } else {
      res.json({ stu: false });
      console.log("0ssssssss");
    }
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
