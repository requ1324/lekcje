const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const data = require("./data.json");

app.get("/data", (req, res) => {
  res.json(data);
});

app.listen(3000, () => {
  console.log("Server started");
});
