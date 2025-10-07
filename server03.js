const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");

const hbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');


const context = {
    subject: "ćwiczenie 3 - dane z tablicy obiektów",
    books: [
        { title: "Lalka", author: "B Prus", lang: "PL" },
        { title: "Hamlet", author: "W Szekspir", lang: "ENG" },
        { title: "Pan Wołodyjowski", author: "H Sienkiewicz", lang: "PL" },
        { title: "Homo Deus", author: "Yuval Noah Harari", lang: "CZ" }
    ]
}

app.use(express.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.render('index03.hbs', context);

})





app.listen(PORT, function () {
    console.log("serwer działa ")
})