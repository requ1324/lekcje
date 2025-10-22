const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");
const Datastore = require('nedb')

const { engine } = require('express-handlebars');
const { timeStamp } = require('console');

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', engine({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');


const coll1 = new Datastore({
    filename: 'db/index2.db',
    autoload: true
});


const context = {
    subject: "02: nedb - insert, sort",
}

app.use(express.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {

    let { login, password } = req.query;
    if (login && password) {
        coll1.insert({ login, password, timeStamp: Date.now() }, function (err, newDoc) {
            console.log("Insert działa");

            coll1.find({}, function (err, docs) {
                docs.forEach((doc, id) => {
                    doc.index = id;
                })
                context.users = docs;
                res.render('index02.hbs', context);

            });


        });
    }



})

app.listen(PORT, function () {
    console.log("serwer działa ")
})