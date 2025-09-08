const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", function (req, res) {
  let value = req.query.value;
  let toRad = req.query.toRad;

  if (toRad == "true") {
    let answer = value * (Math.PI / 180);
    answer = Math.round(answer * 100) / 100;
    res.send(`${value} stopni to ${answer} radianów`);
  } else if (toRad == "false") {
    let answer = value * (180 / Math.PI);
    answer = Math.round(answer * 100) / 100;
    res.send(`${value} radianów to ${answer} stopni`);
  }
});

app.listen(PORT, function () {
  console.log("Server is working at port" + PORT);
});
