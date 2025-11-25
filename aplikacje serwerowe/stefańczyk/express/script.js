const express = require('express');
const app = express();
const PORT = 3000;
const path = require("path");
const Datastore = require('nedb')

const { engine } = require('express-handlebars');
app.use(express.static('static'));

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', engine({ defaultLayout: 'main.hbs' }));
app.set('view engine', 'hbs');


const coll1 = new Datastore({
    filename: 'db/cars.db',
    autoload: true
});



app.use(express.urlencoded({
    extended: true
}));



const cars = [
    'Golf',
    'Astra',
    'Focus',
    'Octavia'
]

app.get("/", function (req, res) {


    const context = {
        subject: "Project Cars",
    }
    res.render("index.hbs", context)
})

app.get("/addCar", function (req, res) {

    const context = {
        subject: "Add Car Page"
    }
    res.render("add.hbs", context);
})

app.get("/listCar", function (req, res) {

    coll1.find({}, function (err, docs) {
        console.log("----- tablica obiektów pobrana z bazy: ", docs)
        const context = {
            subject: "List Car Page",
            items: docs
        }
        res.render("list.hbs", context);
    });

})

app.post("/addForm", function (req, res) {
    const ubezpieczony = req.body.ubezpieczony;
    const benzyna = req.body.benzyna;
    const uszkodzony = req.body.uszkodzony;
    const naped = req.body.naped;

    let index = Math.floor(Math.random() * cars.length);
    let car = cars[index];

    const doc = {
        model: car,
        ubezpieczony: ubezpieczony == 'on' ? "TAK" : "NIE",
        benzyna: benzyna == 'on' ? "TAK" : "NIE",
        uszkodzony: uszkodzony == 'on' ? "TAK" : "NIE",
        naped4x4: naped == 'on' ? "TAK" : "NIE",
    }


    let context;
    coll1.insert(doc, function (err, newDoc) {
        console.log(`new car (Model:${car}) with id = ${newDoc._id} added to database`);
        context = {
            subject: "Add Car Page",
            res: `new car (Model:${car}) with id = ${newDoc._id} added to database`
        }
        res.render("add.hbs", context);
    });
})

app.listen(PORT, function () {
    console.log("serwer działa ")
})