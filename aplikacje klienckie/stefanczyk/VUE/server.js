const express = require("express");
const app = express();
const PORT = 3000;
const fs = require("fs");
const path = require("path");

app.use(express.static("."));

const folders = fs.readdirSync(__dirname + "/static/cwiczenia/");
app.use(express.static("static/cwiczenia/lekcja01"));
app.use(express.static("static"));

let files = {
  folders: [],
  lessons: [],
};

folders.forEach((folderName) => {
  let lessons = fs.readdirSync(__dirname + "/static/cwiczenia/" + folderName);
  files.folders.push(folderName);
  files.lessons.push(lessons);
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/static/index.html"));
});

app.get("/handle", function (req, res) {
  res.send(JSON.stringify(files));
});

app.get("/static/cwiczenia/:folder/:file", function (req, res) {
  const folder = req.params.folder;
  const file = req.params.file;
  const filePath = path.join(__dirname, "static", "cwiczenia", folder, file);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).send("Plik nie został znaleziony");
  }
});

app.get("/api/data", function (req, res) {
  const data = [
    { id: 1, name: "Jan" },
    { id: 2, name: "Anna" },
    { id: 3, name: "Piotr" },
  ];
  res.json(data);
});

app.listen(PORT, function () {
  console.log("Serwer działa na porcie " + PORT);
});
