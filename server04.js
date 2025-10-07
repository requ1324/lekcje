const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");

const hbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');


const context = {
    subject: "ćwiczenie 4 - dane z tablicy, select",
    fields: [
        { name: "title" },
        { name: "author" },
        { name: "lang" }
    ],
    books: [
        { title: "Lalka", author: "B Prus", lang: "PL" },
        { title: "Hamlet", author: "W Szekspir", lang: "ENG" },
        { title: "Pan Wołodyjowski", author: "H Sienkiewicz", lang: "PL" },
        { title: "Zamek", author: "F Kafka", lang: "CZ" }
    ]
}

app.use(express.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.render('index04.hbs', context);

})

app.get("/handleForm", function (req, res) {
    let context2 = [];

    if (req.query.select == "title") {
        context.books.forEach(book => {
            context2.push({ item: book.title });
        })
    } else if (req.query.select == "author") {
        context.books.forEach(book => {
            context2.push({ item: book.author });
        })

    } else if (req.query.select == "lang") {
        context.books.forEach(book => {
            context2.push({ item: book.lang });
        })
    } else if (req.query.select == undefined) {
        context2.push({ item: "Nic nie wybrano" })
    }
    res.render('index041.hbs', { books: context2 });
})





app.listen(PORT, function () {
    console.log("serwer działa ")
})