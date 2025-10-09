const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");

const hbs = require('express-handlebars');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');


const context = {
    subject: "ćwiczenie 2 - podstawowy context",
    content: "to jest lorem ipsum",
    footer: "to jest stopka na mojej stronie"
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