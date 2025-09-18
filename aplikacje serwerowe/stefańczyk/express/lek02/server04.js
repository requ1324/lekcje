const express = require("express");
const app = express();
const PORT = 3000;

app.use(
  express.urlencoded({
    extended: true,
  })
);

let auta = [
  "audi",
  "opel",
  "francuz",
  "duzy fiat",
  "mercedes",
  "male fajne autko",
];

app.get("/", function (req, res) {
  res.set("content-type", "text/html");
  res.write(`<form action="/handleForm" method="post">
        <table>
        <tr>
        <td>nowe</td>
        <td>uzywane</td>
        <td>powypadkowe</td>
        </tr>`);

  for (auto of auta) {
    res.write(`<tr>
            <td>${auto}</td>
            <td><input type="radio" name="${auto}" value="1"></td>
            <td><input type="radio" name="${auto}" value="2"></td>
            <td><input type="radio" name="${auto}" value="3"></td>
            </tr>`);
  }
  res.write(`</table><input type="submit"></form>`);
  res.end();
});

app.post("/handleForm", function (req, res) {
  let wynik = {
    nowe: 0,
    uzywane: 0,
    powypadkowe: 0,
  };
  for (auto of auta) {
    if (req.body[auto] == "1") {
      wynik.nowe += 1;
    } else if (req.body[auto] == "2") {
      wynik.uzywane += 1;
    } else if (req.body[auto] == "3") {
      wynik.powypadkowe += 1;
    }
  }
  console.log(wynik);
});
app.listen(PORT, function () {
  console.log("Server started at port " + PORT);
});
