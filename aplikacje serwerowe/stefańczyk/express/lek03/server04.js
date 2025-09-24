const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");

app.use(express.json());


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/pages/server04.html"));

})

app.post("/test", function (req, res) {

    let range1 = parseInt(req.body.range1);
    res.send(range1);
})


app.listen(PORT, function () {
    console.log("serwer działa ")
})