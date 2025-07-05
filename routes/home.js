const express = require("express");
const axios = require("axios");
const router = express.Router();
const path = require("path");
const routeGuard = require("../middleware/verifyToken");
router.get("/start", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "login.html"));
});

module.exports = router;
