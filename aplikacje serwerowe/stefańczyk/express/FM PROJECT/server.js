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
  }),
);

let currentPath = "/upload";

function renderFilesFolders(res, path2) {
  let folders = [];
  let files2 = [];

  console.log("path2: " + path2);

  if (path2 !== undefined) {
    if (
      "/upload" ===
      path2[0] + path2[1] + path2[2] + path2[3] + path2[4] + path2[5] + path2[6]
    ) {
      currentPath = path2;
    } else {
      currentPath = "/upload" + path2;
      console.log("path2 - ", path2);
    }
  }

  let pathArr = currentPath.split("/");

  let paths = [];

  pathArr.forEach((p) => {
    let newPath = "";
    for (let i = 1; i <= pathArr.indexOf(p); i++) {
      newPath += pathArr[i] + "/";
    }
    paths.push({ name: p, path: newPath });
    console.log(newPath);
  });

  console.log("pathArr:", pathArr, "paths:", paths);

  console.log("currentPath - ", currentPath);

  fs.readdir(__dirname + currentPath, (err, files) => {
    if (err) throw err;
    console.log("lista 2 - ", files);

    files.forEach((file) => {
      fs.lstat(path.join(__dirname, currentPath, file), (err, stats) => {
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
      root: paths,
    });
  });
}

app.get("/", (req, res) => {
  renderFilesFolders(res, "/upload");
});

app.post("/addFolder", (req, res) => {
  const folderName = req.body.folderName;
  const filepath = path.join(__dirname, currentPath);
  fs.readdir(__dirname + currentPath, (err, files) => {
    if (err) throw err;
    console.log("lista 1 - ", files);
    let newPath = currentPath + "/" + folderName;
    fs.mkdir(`${filepath}/${folderName}`, (err) => {
      if (err) throw err;
      console.log("dodany nowy folder" + folderName);
      renderFilesFolders(res, currentPath);
    });
  });
});

app.get("/deleteFolder", (req, res) => {
  const folderName = req.query.name;
  const filepath = path.join(__dirname, currentPath, folderName);

  if (fs.existsSync(filepath)) {
    fs.rmdir(filepath, { recursive: true }, (err) => {
      if (err) throw err;
      console.log(`Usunięto folder: ${folderName}`);

      renderFilesFolders(res, currentPath);
    });
  } else {
    res.send("Folder nie istnieje");
    res.redirect("/");
  }
});

app.post("/addFile", (req, res) => {
  const fileName = req.body.fileName;
  const filepath = path.join(__dirname, currentPath);
  fs.readdir(__dirname + currentPath, (err, files) => {
    if (err) throw err;
    console.log("lista 1 - ", files);

    fs.writeFile(`${filepath}/${fileName}`, "", (err) => {
      if (err) throw err;
      console.log("dodany nowy plik" + fileName);
      renderFilesFolders(res, currentPath);
    });
  });
});

app.get("/deleteFile", (req, res) => {
  const fileName = req.query.name;
  const filepath = path.join(__dirname, currentPath, fileName);

  if (fs.existsSync(filepath)) {
    fs.unlink(filepath, (err) => {
      if (err) throw err;
      console.log(`Usunięto plik: ${fileName}`);
      renderFilesFolders(res, currentPath);
    });
  } else {
    res.send("Plik nie istnieje");
    res.redirect("/");
  }
});

app.get("/upload", (req, res) => {
  const files = req.query.upload;
  const filepath = path.join(__dirname, currentPath);

  if (!files) {
    res.redirect("/");
    return;
  }

  if (Array.isArray(files)) {
    files.forEach((file) => {
      fs.readdir(__dirname + currentPath, (err, files) => {
        if (err) throw err;
        console.log("lista 1 - ", file);

        fs.writeFile(`${filepath}/${file}`, "", (err) => {
          if (err) throw err;
          console.log("dodany nowy plik" + file);
          renderFilesFolders(res, currentPath);
        });
      });
    });
  } else {
    const fileName = files;
    fs.readdir(__dirname + currentPath, (err, files) => {
      if (err) throw err;
      console.log("lista 1 - ", files);

      fs.writeFile(`${filepath}/${fileName}`, "", (err) => {
        if (err) throw err;
        console.log("dodany nowy plik" + fileName);
        renderFilesFolders(res, currentPath);
      });
    });
  }
});

app.get("/move", (req, res) => {
  const path = req.query.path;
  console.log(path);
  let newPath;
  if (
    "/upload" ===
    path[0] + path[1] + path[2] + path[3] + path[4] + path[5] + path[6]
  ) {
    newPath = path;
  } else {
    newPath = currentPath + path;
  }

  renderFilesFolders(res, newPath);
});

app.get("/rename", (req, res) => {
  const newFolderName = req.query.newFolderName;
  const folderName = req.query.folderName;
  const oldPath = path.join(__dirname, currentPath, folderName);
  const newPath = path.join(__dirname, currentPath, newFolderName);
  console.log(newPath);
  if (!fs.existsSync(newPath)) {
    fs.rename(oldPath, newPath, (err) => {
      if (err) console.log(err);
      else {
        res.redirect(`/move?path=${currentPath}`);
      }
    });
  } else {
    res.redirect(`/move?path=${currentPath}`);
    alert("Nie ma takiego katalogu lub pliku");
  }
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
