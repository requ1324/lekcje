const express = require("express");
const app = express();
const PORT = 3000;

app.get("/", function (req, res) {
  let content = "";

  for (let i = 0; i < 50; i++) {
    let random = Math.floor(Math.random() * 101);
    content += `<a style="margin:10px" href="http://localhost:3000/product/${random}">Produkt o id ${random}</a>`;
  }
  res.send(content);
});

app.get("/product/:id", function (req, res) {
  let id = req.params.id;
  res.send(`Strona dla produktu o id ${id}`);
});

app.listen(PORT, function () {
  console.log("Server is working at port" + PORT);
});
