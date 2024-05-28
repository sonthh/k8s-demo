const dotEnv = require("dotenv");
const express = require("express");

dotEnv.config();
const app = express();

const port = process.env.PORT || 5000;
const dbName = process.env.DB_NAME || "No DB Name";

app.get("/", (_, res) => {
  res.send("Hello World! 2024 " + dbName);
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
