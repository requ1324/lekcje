const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");

app.use(express.json());


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/static/pages/server02.html"));

})

app.post("/test", function (req, res) {

    let num1 = parseInt(req.body.num1);
    let num2 = parseInt(req.body.num2);
    if (req.body.choice == "suma") {

        res.send({ message: "suma dwóch elementów", wynik: num1 + num2 });
    } else if (req.body.choice == "różnica") {
        res.send({ message: "roznica dwóch elementów", wynik: num1 - num2 });
    } else if (req.body.choice == "iloraz") {
        res.send({ message: "iloraz dwóch elementów", wynik: num1 / num2 });
    } else if (req.body.choice == "iloczyn") {

        res.send({ message: "iloczyn dwóch elementów", wynik: num1 * num2 });
    } else if (req.body.choice == "wszystkie") {
        res.send([{ message: "różnica dwóch elementów", wynik: num1 - num2 },
        { message: "suma dwóch elementów", wynik: num1 + num2 },
        { message: "iloraz dwóch elementów", wynik: num1 / num2 },
        { message: "iloczyn dwóch elementów", wynik: num1 * num2 }]);

    }
})


app.listen(PORT, function () {
    console.log("serwer działa ")
})