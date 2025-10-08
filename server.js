const express = require('express');
const app = express();
const PORT = 3000;
const fs = require("fs");
const path = require("path");

const folders = fs.readdirSync(__dirname + "/static/cwiczenia/");
app.use(express.static('static/cwiczenia/lekcja01'))
app.use(express.static('static'))

let files = {
    folders: [],
    lessons: []
};

folders.forEach(folderName => {
    let lessons = fs.readdirSync(__dirname + "/static/cwiczenia/" + folderName);
    files.folders.push(folderName);
    files.lessons.push(lessons);
});

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/index.html"));

})



app.get("/handle", function (req, res) {
    res.send(JSON.stringify(files));

})



app.listen(PORT, function () {
    console.log("Serwer działa na porcie " + PORT);
});
