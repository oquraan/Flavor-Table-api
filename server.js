require("dotenv").config();
const pg = require("pg");

const path = require("path");

const express = require("express");
const cors = require("cors");
const axios = require("axios");
const app = express();
app.use(cors());
// express.json();
app.use(express.json());

app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

const HomePage = require("./routes/home");
const recipe = require("./routes/recipes");
const search = require("./routes/serch");
const details = require("./routes/viewDetails");
const checkTitle = require("./routes/checkItemInDataBase");
const insertDataToDataBase = require("./routes/insert");
const getAllfavorite = require("./routes/getAllFavorite");
const deleteFa = require("./routes/delete");
const ubdateRecipe = require("./routes/update");

app.use("/", HomePage);

app.use(recipe);
app.use(search);
app.use(details);
app.use(checkTitle);
app.use(insertDataToDataBase);
app.use("/recipes/a", getAllfavorite);
app.use("/api", deleteFa);
app.use("/api", ubdateRecipe);

app.use((req, res) => {
  res.status(404).send("Page not found <a href='/'>Get back home</a>");
});
const port = process.env.PORT || 3000;

pool
  .connect()
  .then((client) => {
    return client
      .query("SELECT current_database(), current_user")
      .then((res) => {
        client.release();

        const dbName = res.rows[0].current_database;
        const dbUser = res.rows[0].current_user;
        console.log("✅ Connected to DB:", res.rows[0]);

        console.log(
          `Connected to PostgreSQL as user '${dbUser}' on database '${dbName}'`
        );

        console.log(`App listening on port http://localhost:${port}`);
      });
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`app listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Could not connect to database:", err);
  });
