const express = require("express");
const app = express();
const PORT = 3000;
const { create } = require("express-handlebars");
const path = require("path");
const fs = require("fs");
const { get } = require("http");

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

function renderFilesFolders(res, root) {
  let folders = [];
  let files2 = [];
  fs.readdir(__dirname + "/upload", (err, files) => {
    if (err) throw err;
    console.log("lista 2 - ", files);

    files.forEach((file) => {
      fs.lstat(path.join(__dirname, "upload", file), (err, stats) => {
        if (stats.isDirectory()) {
          folders.push(file);
        } else {
          files2.push(file);
        }
      });
    });

    res.render("fileMenager.hbs", {
      title: "File Menager",
      files: files2,
      folders: folders,
      root: root,
    });
  });
}

app.get("/", (req, res) => {
  renderFilesFolders(res, __dirname);
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
      renderFilesFolders(res, __dirname);
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

      renderFilesFolders(res, __dirname);
      res.redirect("/");
    });
  } else {
    res.send("Folder nie istnieje");
  }
});

app.post("/addFile", (req, res) => {
  const fileName = req.body.fileName;
  const filepath = path.join(__dirname, "upload");
  fs.readdir(__dirname + "/upload", (err, files) => {
    if (err) throw err;
    console.log("lista 1 - ", files);

    fs.writeFile(`${filepath}/${fileName}`, "", (err) => {
      if (err) throw err;
      console.log("dodany nowy plik" + fileName);
      renderFilesFolders(res, __dirname);
    });
  });
});

app.get("/deleteFile", (req, res) => {
  const fileName = req.query.name;
  const filepath = path.join(__dirname, "upload", fileName);

  if (fs.existsSync(filepath)) {
    fs.unlink(filepath, (err) => {
      if (err) throw err;
      console.log(`Usunięto plik: ${fileName}`);
      renderFilesFolders(res, __dirname);
      res.redirect("/");
    });
  } else {
    res.send("Plik nie istnieje");
  }
});

app.get("/upload", (req, res) => {
  const files = req.query.upload;
  const filepath = path.join(__dirname, "upload");

  if (Array.isArray(files)) {
    files.forEach((file) => {
      fs.readdir(__dirname + "/upload", (err, files) => {
        if (err) throw err;
        console.log("lista 1 - ", file);

        fs.writeFile(`${filepath}/${file}`, "", (err) => {
          if (err) throw err;
          console.log("dodany nowy plik" + file);
          renderFilesFolders(res, __dirname);
        });
      });
    });
  } else {
    const fileName = files;
    fs.readdir(__dirname + "/upload", (err, files) => {
      if (err) throw err;
      console.log("lista 1 - ", files);

      fs.writeFile(`${filepath}/${fileName}`, "", (err) => {
        if (err) throw err;
        console.log("dodany nowy plik" + fileName);
        renderFilesFolders(res, __dirname);
      });
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
