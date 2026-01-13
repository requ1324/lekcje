const express = require("express");
const app = express();
const PORT = 3000;
const { create } = require("express-handlebars");
const path = require("path");
const fs = require("fs");

const hbs = create({
  defaultLayout: "main.hbs",
  extname: ".hbs",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("static"));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  fs.readdir(__dirname + "/upload", (err, files) => {
    if (err) throw err;
    console.log("lista 2 - ", files);
    res.render("fileMenager.hbs", {
      title: "File Menager",
      folders: files,
    });
  });
});

app.post("/addFolder", (req, res) => {
  const folderName = req.body.folderName;
  const filepath = path.join(__dirname, "upload");
  fs.readdir(__dirname + "/upload", (err, files) => {
    if (err) throw err;
    console.log("lista 1 - ", files);

    fs.mkdir(`${filepath}/${folderName}`, (err) => {
      if (err) throw err;
      console.log("dodany nowy folder" + folderName);

      fs.readdir(__dirname + "/upload", (err, files) => {
        if (err) throw err;
        console.log("lista 2 - ", files);
        res.render("fileMenager.hbs", {
          title: "File Menager",
          folders: files,
        });
      });
    });
  });
});

app.get("/deleteFolder", (req, res) => {
  const folderName = req.query.name;
  const filepath = path.join(__dirname, "upload", folderName);

  if (fs.existsSync(filepath)) {
    fs.rmdir(filepath, (err) => {
      if (err) throw err;
      console.log(`Usunięto folder: ${folderName}`);

      fs.readdir(__dirname + "/upload", (err, files) => {
        if (err) throw err;
        console.log("lista po usunięciu - ", files);
        res.render("fileMenager.hbs", {
          title: "File Menager",
          folders: files,
        });
      });
      res.redirect("/");
    });
  } else {
    res.send("Folder nie istnieje");
  }
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
