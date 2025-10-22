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
    filename: 'db/index3.db',
    autoload: true
});


const context = {
    subject: "03: nedb - remove, find",
}

app.use(express.urlencoded({
    extended: true
}));

app.get("/", function (req, res) {
    let { ids } = req.query;
    coll1.find({}, function (err, docs) {
        docs.forEach((doc, id) => {
            doc.index = id;

        })
        context.items = docs;
        if (ids) {
            if (!Array.isArray(ids)) {
                ids = [ids];
            }

            ids.forEach(id => {
                coll1.remove({ _id: id }, {}, function (err, numRemoved) {
                    console.log("usunięto dokumentów: ", numRemoved);
                });
            });

        }

        res.render('index3.hbs', context);



    });



})

app.listen(PORT, function () {
    console.log("serwer działa ")
})