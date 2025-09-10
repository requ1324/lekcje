const express = require("express");
const app = express();
const PORT = 3000;

app.use(
  express.urlencoded({
    extended: true,
  })
);

let users = [];

app.get("/", function (req, res) {
  res.set("content-type", "text/html");
  res.write(
    `<form action="/handleForm" method="POST"><label for="nick">nick:</label><input type="text" name="nick">
    <label for="email">email:</label><input type="email" name="email"><input type="submit"></form>`
  );
  res.write(`<a href="http://localhost:3000/removeBySelect">usun email z uzyciem selecta</a><br></br>
        <a href="http://localhost:3000/removeByRadio">usun email z uzyciem radio</a><br></br>
        <a href="http://localhost:3000/removeByCheckboxes">usun email z uzyciem checkbox-ow</a>`);
});

app.post("/handleForm", function (req, res) {
  let user = {
    nick: req.body.nick,
    email: req.body.email,
  };

  let exists = users.some((u) => u.email === user.email);
  if (exists) {
    res.send("Ten user juz istnieje");
  } else {
    users.push(user);
    res.send("Pomyslne dodano nowego uzytkownika");
  }
});

app.get("/removeBySelect", function (req, res) {
  res.write(
    `<form action="" method="POST"><label for="nick">nick:</label><input type="text" name="nick">
        <label for="email">email:</label><input type="email" name="email"><input type="submit"></form>`
  );
});
app.get("/removeByRadio", function (req, res) {});
app.get("/removeByCheckboxes", function (req, res) {});

app.listen(PORT, function () {
  console.log("Server started at port " + PORT);
});
