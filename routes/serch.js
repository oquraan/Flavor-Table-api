const express = require("express");
const axios = require("axios");
require("dotenv").config();
let num = 0;
const router = express.Router();
let response;
const routeGuard = require("../middleware/verifyToken");

router.get("/recipes/search", routeGuard, async (req, res) => {
  try {
    const ingredient = req.query.ingredients;

    if (!ingredient || ingredient.trim() === "")
      return res.status(400).json({ error: "ingredients query is required" });

    response = await axios.get(
      `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${req.query.ingredients}&number=5&apiKey=${process.env.APIKEY}`
    );

    num++;
    // let obj = {
    //   title: response.data.recipes[0].title,
    //   image: response.data.recipes[0].image,
    //   instructions: response.data.recipes[0].instructions,
    //   extendedIngredients: response.data.recipes[0].extendedIngredients,
    // };
    let objs = [];
    // console.log(res.data);
    // console.log(response.data);
    // console.log(response.data.length);

    for (let index = 0; index < response.data.length; index++) {
      objs[index] = {
        id: response.data[index].id,
        title: response.data[index].title,
        image: response.data[index].image,
        missedIngredients: response.data[index].missedIngredients.map(
          (item) => item.name
        ),
        usedIngredients: response.data[index].usedIngredients.map(
          (item) => item.name
        ),
      };
      // console.log(objs[index]);
    }
    // console.log(objs);
    res.json(objs);

    // console.log(response.data.recipes[0].title);
    // console.log(num);
  } catch (error) {
    console.error("Error fetching recipes:", error.message);

    res
      .status(500)
      .json({ error: "Failed to fetch recipes. Try again later." });
  }
});

module.exports = router;
