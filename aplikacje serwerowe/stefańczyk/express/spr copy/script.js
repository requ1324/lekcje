const express = require("express");
const path = require("path");
const { create } = require("express-handlebars");
const PORT = 4000;
const app = express();
const hbs = create({
  defaultLayout: "main.hbs", // Domyślny layout: views/layouts/main.hbs
  extname: ".hbs",
  partialsDir: "views/partials",
  helpers: {
    parseDate: function (date) {
      const data = new Date(date);
      return data.toISOString();
    },
  }, // rozszerzenie plików szablonów
});

app.engine(".hbs", hbs.engine); // określenie silnika szablonów
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views")); // ustalamy katalog views

const data = require("./data.json");

app.get("/", function (req, res) {
  let context = {
    items: [],
    categories: [],
  };

  data.products.map((item) => {
    if (!context.categories.includes(item.category)) {
      context.categories.push(item.category);
    }
    let avarage = "Brak ocen";
    if (item.reviews.length !== 0) {
      let avg = 0;
      for (let i = 0; i < item.reviews.length; i++) {
        avg += item.reviews[i].stars;
      }
      avarage = (avg / item.reviews.length).toFixed(2);
    }

    context.items.push({
      category: item.category,
      title: item.title,
      avg: avarage,
    });
  });

  res.render("index.hbs", context);
});

app.listen(PORT, function () {
  console.log("Server started at port " + PORT);
});
