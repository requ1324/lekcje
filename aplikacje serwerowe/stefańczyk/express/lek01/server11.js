const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");

app.get("/product_id/:id", function (req, res) {
  let id = req.params.id;
  if (id == 1) {
    res.sendFile(path.join(__dirname, "/static/products/product1.html"));
  } else if (id == 2) {
    res.sendFile(path.join(__dirname, "/static/products/product2.html"));
  } else if (id == 3) {
    res.sendFile(path.join(__dirname, "/static/products/product3.html"));
  } else {
    res.send("Nie ma takiego produktu");
  }
});

app.listen(PORT, function () {
  console.log("Server is working at port" + PORT);
});
