const express = require("express");
const bodyParser = require("body-parser");
const { getFollowers } = require("./handler");

const app = express();

app.use(bodyParser.json());

app.post("/followers", getFollowers);

app.listen(process.env.PORT || 5000, () => {
  console.log("server running ");
});




