const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");

const hbs = require('express-handlebars');
let context = require("./data/data09.json")
app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    helpers: {
        shortTitle: function (title) {
            return title.substring(0, 10) + "...";
        },
        bigTitle: function (title) {
            return title.toUpperCase();
        },
        myslniki: function (title) {
            return title.split("").join("-");
        }

    }
}));
app.set('view engine', 'hbs');





app.use(express.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.render('index09.hbs', context);

})






app.listen(PORT, function () {
    console.log("serwer działa ")
})