const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");
const formidable = require('formidable');


app.use(express.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/pages/server02.html"));

})

app.post("/handleForm", function (req, res) {
    let form = formidable({});

    form.multiples = true;
    form.keepExtensions = true;

    form.uploadDir = __dirname + "/static/upload/";

    form.parse(req, function (err, fields, files) {
        console.log("Przesyłam dane z formularza");
        console.log(fields);
        console.log("przesłany plik");
        console.log(files);
        res.send(JSON.stringify([{ date: fields.date, text: fields.text },
        [files]], null, 5));
    })
})


app.listen(PORT, function () {
    console.log("serwer działa ")
})