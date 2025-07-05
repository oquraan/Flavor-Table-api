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
const routeGuard = require("../middleware/verifyToken");

router.put("/update/:id", routeGuard,async (req, res) => {
  //   const recipe = {
  //   title: "Pizza",
  //   instructions: "Mix ingredientsBake for 20 minutes",
  //   readyln: "30",
  //   ingredients: ["Flour", "Tomato", "Cheese"], // ✅ Array = JSONB جاهز
  // };
  const id = req.params.id;
  console.log(" sssssssssssssssssssssssfffff" + id + "sxxxxxxxxxxxxx");
  const { title, instructions, ingredients, readyln } = req.body;
  console.log(req.body);
  try {
    const result = await pool.query(
      "UPDATE recipes set title=$1,instructions=$2,ingredients=$3,readyln=$4 where IdRE=$5  RETURNING *",
      [title, instructions, JSON.stringify(ingredients), readyln, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Recipe not found." });
    }
    res.json(result.rows[0]);
    console.log(result.rows[0]);
  } catch (err) {
    res.status(500).send("Errordddddd" + err);
  }
});
module.exports = router;
