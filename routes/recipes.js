const express = require("express");
const axios = require("axios");
require("dotenv").config();
let num = 0;
const router = express.Router();
let response;
const cors = require("cors");

router.use(cors());

router.get("/recipes/random", async (req, res) => {
  try {
    console.log(num);

    response = await axios.get(
      `https://api.spoonacular.com/recipes/random?number=1&apiKey=${process.env.APIKEY}`
    );

    num++;
    let obj = {
      id: response.data.recipes[0].id,
      title: response.data.recipes[0].title,
      image: response.data.recipes[0].image,
      instructions: response.data.recipes[0].instructions,
      extendedIngredients: response.data.recipes[0].extendedIngredients,
    };
    res.json(obj);

    console.log(response.data.recipes[0].title);
    console.log(num);
  } catch (error) {
    console.error("Error fetching random recipe:", error.message);
    let obj = {
      error: "somthing habpend  ",
    };
    res.status(500).json({
      error: "Something went wrong while fetching a random recipe.",
    });
  }
});

module.exports = router;
