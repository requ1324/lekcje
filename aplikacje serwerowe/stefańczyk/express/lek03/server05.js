const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");

app.use(express.json());

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/server05.html"));
});

app.post("/test", function (req, res) {
  let rangeR = parseInt(req.body.rangeR);
  let rangeG = parseInt(req.body.rangeG);
  let rangeB = parseInt(req.body.rangeB);
  let rangeA = parseFloat(req.body.rangeA);
  res.json({
    rangeR,
    rangeG,
    rangeB,
    rangeA,
  });
});

app.listen(PORT, function () {
  console.log("serwer działa ");
});
