const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");

const hbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');


app.use(express.urlencoded({
    extended: true
}));

app.get("/login", function (req, res) {
    res.render('login.hbs');

})

app.get("/index", function (req, res) {
    res.render('index.hbs');

})




app.listen(PORT, function () {
    console.log("serwer działa ")
})