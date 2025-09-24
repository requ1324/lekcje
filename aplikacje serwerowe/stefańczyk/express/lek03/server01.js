const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");

app.use(express.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/pages/formularz.html"));

})

app.post("/", function (req, res) {
    res.header("content-type", "application/json")
    let num1 = parseInt(req.body.num1);
    let num2 = parseInt(req.body.num2);
    if (req.body.select == "suma") {


        res.send(JSON.stringify({ message: "suma dwóch elementów", wynik: num1 + num2 }, null, 5));
    } else if (req.body.select == "różnica") {

        res.send(JSON.stringify({ message: "różnica dwóch elementów", wynik: num1 - num2 }, null, 5));
    } else if (req.body.select == "iloraz") {

        res.send(JSON.stringify({ message: "iloraz dwóch elementów", wynik: num1 / num2 }, null, 5));
    } else if (req.body.select == "iloczyn") {

        res.send(JSON.stringify({ message: "iloczyn dwóch elementów", wynik: num1 * num2 }, null, 5));
    } else if (req.body.select == "wszystkie") {

        res.send(JSON.stringify([{ message: "różnica dwóch elementów", wynik: num1 - num2 },
        { message: "suma dwóch elementów", wynik: num1 + num2 },
        { message: "iloraz dwóch elementów", wynik: num1 / num2 },
        { message: "iloczyn dwóch elementów", wynik: num1 * num2 }]), null, 5);

    }
})


app.listen(PORT, function () {
    console.log("serwer działa ")
})