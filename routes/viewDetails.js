const express = require("express");
const axios = require("axios");
require("dotenv").config();
let num = 0;
const router = express.Router();
let response;

router.get("/recipes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log("Ssssssssssssssssssssssssssss");
    if (!id || id.trim() === "")
      return res.status(400).json({ error: "ingredients query is required" });

    response = await axios.get(
      `https://api.spoonacular.com/recipes/${id}/information?apiKey=${process.env.APIKEY}`
    );

    num++;
    let objs;

    // for (let index = 0; index < response.data.length; index++) {
    objs = {
      id: response.data.id,
      title: response.data.title,
      image: response.data.image,
      summary: response.data.summary,

      readyInMinutes: response.data.readyInMinutes,
    };
    // }
    console.log(objs);
    res.json(objs);
  } catch (error) {
    console.error("Error fetching recipes:", error.message + "vcd");

    res
      .status(500)
      .json({ error: "Failed to fetch recipes. Try again later." });
  }
});

module.exports = router;
