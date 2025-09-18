const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", function (req, res) {
  let count = req.query.count;
  let color = req.query.color;

  let content = "";

  for (let i = 0; i < count; i++) {
    content += `<div style="margin:10px; background:${color}">${i}</div>`;
  }
  res.send(content);
});

app.listen(PORT, function () {
  console.log("Server is working at port" + PORT);
});
