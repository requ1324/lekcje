const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");
const formidable = require('formidable');

app.use(express.static('static'))


app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/pages/server04.html"));

})

app.post("/handleForm", function (req, res) {
    let form = formidable({});

    form.multiples = true;
    form.keepExtensions = true;

    form.uploadDir = __dirname + "/static/upload/";

    form.parse(req, function (err, fields, files) {
        console.log("Przesyłam dane z formularza");

        console.log("przesłany plik");
        console.log(files);
        let url = files.file.path.split("\\");
        res.send(JSON.stringify(url[url.length - 1]));
    })
})


app.listen(PORT, function () {
    console.log("serwer działa ")
})