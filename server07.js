const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");

const hbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');


let context = require("./data/data.json")


app.use(express.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    res.render('index07.hbs', context);

})






app.listen(PORT, function () {
    console.log("serwer działa ")
})