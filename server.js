require("dotenv").config();
const path = require("path");

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

const HomePage = require("./routes/home");
const recipe = require("./routes/recipes");
const search = require("./routes/serch");
const details = require("./routes/viewDetails");

app.use("/", HomePage);

app.use(recipe);
app.use(search);
app.use(details);

app.use((req, res) => {
  res.status(404).send("Page not found <a href='/'>Get back home</a>");
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app listening on port http://localhost:${port}`);
});
