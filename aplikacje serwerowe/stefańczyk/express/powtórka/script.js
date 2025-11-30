const express = require("express");
const app = express();
const PORT = 3000;
const path = require("path");
const Datastore = require("nedb");

const { engine } = require("express-handlebars");
app.use(express.static("static"));

app.use(express.json());

app.set("views", path.join(__dirname, "views"));
app.engine("hbs", engine({ defaultLayout: "main.hbs" }));
app.set("view engine", "hbs");

const coll1 = new Datastore({
  filename: "db/cars.db",
  autoload: true,
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

const cars = ["Golf", "Astra", "Focus", "Octavia"];

app.get("/", function (req, res) {
  const context = {
    subject: "Project Cars",
  };
  res.render("index.hbs", context);
});

app.get("/addCar", function (req, res) {
  const context = {
    subject: "Add Car Page",
  };
  res.render("add.hbs", context);
});

app.get("/listCar", function (req, res) {
  coll1.find({}, function (err, docs) {
    console.log("----- tablica obiektów pobrana z bazy: ", docs);
    const context = {
      subject: "List Car Page",
      items: docs,
      itemsJson: JSON.stringify(docs),
    };
    res.render("list.hbs", context);
  });
});

app.post("/addForm", function (req, res) {
  const ubezpieczony = req.body.ubezpieczony;
  const benzyna = req.body.benzyna;
  const uszkodzony = req.body.uszkodzony;
  const naped = req.body.naped;

  let index = Math.floor(Math.random() * cars.length);
  let car = cars[index];

  const doc = {
    model: car,
    ubezpieczony: ubezpieczony == "on" ? "TAK" : "NIE",
    benzyna: benzyna == "on" ? "TAK" : "NIE",
    uszkodzony: uszkodzony == "on" ? "TAK" : "NIE",
    naped4x4: naped == "on" ? "TAK" : "NIE",
  };

  let context;
  coll1.insert(doc, function (err, newDoc) {
    console.log(
      `new car (Model:${car}) with id = ${newDoc._id} added to database`
    );
    context = {
      subject: "Add Car Page",
      res: `new car (Model:${car}) with id = ${newDoc._id} added to database`,
    };
    res.render("add.hbs", context);
  });
});

app.get("/deleteCar", function (req, res) {
  coll1.find({}, function (err, docs) {
    console.log("----- tablica obiektów pobrana z bazy: ", docs);
    const context = {
      subject: "Delete Car Page",
      items: docs,
      itemsJson: JSON.stringify(docs),
    };
    res.render("delete.hbs", context);
  });
});

app.post("/handleDelete", function (req, res) {
  console.log("handledelete");
  const checkbox = req.body.delete;
  const id = req.body.id;
  coll1.remove({ _id: id }, {}, function (err, numRemoved) {
    console.log(`removed ${numRemoved} documents`);
    res.redirect("/deleteCar");
  });
});

app.post("/handleAllDelete", function (req, res) {
  coll1.remove({}, { multi: true }, function (err, numRemoved) {
    console.log(`removed ${numRemoved} documents`);
    const context = {
      subject: "Delete Car Page",
      info: "Deleted All Cars",
    };
    res.render("delete.hbs", context);
  });
});

app.post("/handleSelected", function (req, res) {
  const ids = req.body.deleteIds;
  const idArray = Array.isArray(ids) ? ids : [ids];
  coll1.remove(
    { _id: { $in: idArray } },
    { multi: true },
    function (err, numRemoved) {
      console.log(`removed ${numRemoved} documents`);
      coll1.find({}, function (err, docs) {
        const context = {
          subject: "Delete Car Page",
          items: docs,
          info: `Deleted ${numRemoved} Cars`,
        };
        res.render("delete.hbs", context);
      });
    }
  );
});

app.get("/editCar", function (req, res) {
  coll1.find({}, function (err, docs) {
    console.log("----- tablica obiektów pobrana z bazy: ", docs);
    const context = {
      subject: "Edit Car Page",
      items: docs,
      itemsJson: JSON.stringify(docs),
    };
    res.render("edit.hbs", context);
  });
});

app.post("/handleEdit", function (req, res) {
  const id = req.body._id;
  const model = req.body.model;
  const ubezpieczony = req.body.ubezpieczony;
  const benzyna = req.body.benzyna;
  const uszkodzony = req.body.uszkodzony;
  const naped4x4 = req.body.naped4x4;

  coll1.update(
    { _id: id },
    {
      $set: {
        model: model,
        ubezpieczony: ubezpieczony,
        benzyna: benzyna,
        uszkodzony: uszkodzony,
        naped4x4: naped4x4,
      },
    },
    {},
    function (err, numReplaced) {
      console.log(`updated ${numReplaced} documents`);
      res.redirect("/editCar");
    }
  );
});

app.get("/searchCar", function (req, res) {
  const context= {
    subject: "Search Car Page",
  };
  res.render("search.hbs", context);
})

app.post("/handleSearch", function (req, res) {
  console.log(req.body);
  const radio = req.body.radio;
  const radio2 = req.body.radio2;

  query[radio] = radio2;
  
  console.log(query);
  coll1.find(query, function (err, docs) {
    const context = {
      subject: "Search Car Page",
      items: docs,
      info: `Found ${docs.length} Cars`,
    };
    res.render("search.hbs", context);
  });
});

app.listen(PORT, function () {
  console.log("serwer działa ");
});
