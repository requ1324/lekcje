const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");

app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/server06.html"));
});

app.post("/test", function (req, res) {
  let x = req.body.x;
  let y = req.body.y;

  res.json({
    x,
    y,
    timestamp: Date.now(),
  });
});

app.listen(PORT, function () {
  console.log("serwer działa ");
});
