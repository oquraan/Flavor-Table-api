require("dotenv").config();

const jwt = require("jsonwebtoken");

function routeGuard(req, res, next) {
  const authHeader = req.headers["authorization"];
  // console.log(authHeader);
  const tokenFromHeader = authHeader && authHeader.split(" ")[1];
  const tokenFromQuery = req.query.token;

  const token = tokenFromHeader || tokenFromQuery;

  if (!token) return res.status(401).send("No token provided, Access Denied");
  console.log(token);

  try {
    const decode = jwt.verify(token, process.env.APIKEY);
    req.user = decode;

    next();
  } catch (error) {
    return res.status(403).send("invalid or expired token");
  }
}
module.exports = routeGuard;
