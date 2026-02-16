const express = require("express");
const app = express();
const PORT = 3000;
const { create } = require("express-handlebars");
const path = require("path");
const fs = require("fs");
const archiver = require("archiver");
const { get } = require("http");
const CONFIG_PATH = path.join(__dirname, "config.json");
const hbs = create({
  defaultLayout: "main.hbs",
  extname: ".hbs",
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("static"));

app.use(express.json());

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
  if (folderName === "") {
    res.redirect("/");
    alert("Musisz cos wpisac");
  }
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
  const fileType = req.body.fileType;
  const filepath = path.join(__dirname, currentPath);

  if (!fileName || !fileType) {
    return res.redirect("/");
  }

  const extensions = {
    html: {
      ext: ".html",
      content:
        '<!DOCTYPE html>\n<html>\n<head>\n  <meta charset="UTF-8">\n  <title>Nowy plik HTML</title>\n</head>\n<body>\n  <h1>Hello HTML 🚀</h1>\n</body>\n</html>',
    },
    css: {
      ext: ".css",
      content: "body {\n  margin: 0;\n  font-family: Arial, sans-serif;\n}",
    },
    js: {
      ext: ".js",
      content: "console.log('Hello JS 🚀');",
    },
    json: {
      ext: ".json",
      content: '{\n  "name": "example",\n  "version": "1.0.0"\n}',
    },
  };

  const fileData = extensions[fileType];
  if (!fileData) {
    return res.redirect("/");
  }

  const fullFileName = fileName.endsWith(fileData.ext)
    ? fileName
    : fileName + fileData.ext;

  fs.writeFile(path.join(filepath, fullFileName), fileData.content, (err) => {
    if (err) throw err;
    console.log("Dodany nowy plik:", fullFileName);
    renderFilesFolders(res, currentPath);
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

app.get("/editor", (req, res) => {
  const fileName = req.query.name;
  const filePath = path.join(__dirname, currentPath, fileName);

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }

    const lines = data.split("\n").map((line, i) => ({
      number: i + 1,
      content: line,
    }));

    res.render("edytor", {
      fileName,
      lines,
    });
  });
});

app.post("/saveFile", (req, res) => {
  const fileName = req.body.fileName;
  const lines = req.body.lines;

  const filePath = path.join(__dirname, currentPath, fileName);
  const content = Array.isArray(lines) ? lines.join("\n") : lines || "";

  fs.writeFile(filePath, content, "utf8", (err) => {
    if (err) {
      console.error(err);
      return res.redirect("/");
    }

    res.redirect("/");
  });
});

app.post("/rename", (req, res) => {
  const newFolderName = req.body.newFolderName;
  const folderName = req.body.folderName;
  const oldPath = path.join(__dirname, currentPath, folderName);
  const newPath = path.join(__dirname, currentPath, newFolderName);
  if (newFolderName === "") {
    res.redirect("/");
    alert("Musisz cos wpisac");
  }
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

app.get("/downloadFile", (req, res) => {
  const name = req.query.name;
  const filepath = path.join(__dirname, currentPath, name);
  res.download(filepath, (err) => {
    if (err) throw err;
  });
});

app.get("/downloadFolder", (req, res) => {
  const folderName = req.query.name;
  if (!folderName) {
    return res.status(400).send("Brak nazwy folderu");
  }
  const folderPath = path.join(__dirname, currentPath, folderName);
  if (!fs.existsSync(folderPath)) {
    return res.status(404).send("Folder nie istnieje");
  }
  res.setHeader("Content-Type", "application/zip");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${folderName}.zip`,
  );
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });
  archive.on("error", (err) => {
    console.error(err);
    res.status(500).send("Błąd archiwizacji");
  });
  archive.pipe(res);
  archive.directory(folderPath, folderName);
  archive.finalize();
});

app.get("/api/editor-config", (req, res) => {
  fs.readFile(CONFIG_PATH, "utf8", (err, data) => {
    if (err) {
      return res.json({
        fontSize: 16,
        backgroundColor: "#ffffff",
      });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/editor-config", (req, res) => {
  console.log("CONFIG BODY:", req.body);
  const config = {
    fontSize: req.body.fontSize,
    backgroundColor: req.body.backgroundColor,
  };

  fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});

app.listen(PORT, () => {
  console.log(`Serwer działa na porcie ${PORT}`);
});
