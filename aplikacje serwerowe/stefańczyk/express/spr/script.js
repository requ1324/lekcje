const express = require("express");
const app = express();
const PORT = 3000;
const { create } = require("express-handlebars");
const path = require("path");

const data = require("./data.json");

const hbs = create({
  defaultLayout: "main.hbs",
  extname: ".hbs",
  partialsDir: "views/partials",
  helpers: {
    parseDate: function (date) {
      const data = new Date(date);
      return data.toISOString();
    },
  },
});

app.engine(".hbs", hbs.engine);
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("static"));

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => {
  //cat tytul average, id
  const items = [];
  const categories = [];

  data.products.map((i) => {
    //cat
    if (!categories.includes(i.category)) {
      categories.push(i.category);
    }

    //avg
    let average = "Brak ocen";
    if (i.reviews.length != 0) {
      let avg = 0;
      i.reviews.map((r) => {
        avg += r.stars;
      });

      average = (avg / i.reviews.length).toFixed(2);
    }

    items.push({ category: i.category, title: i.title, avg: average });
  });

  res.render("index.hbs", { items: items, categories: categories });
});

app.get("/info", (req, res) => {
  const id = req.query.id;
  if (!id) res.redirect("/");
  else {
    const item = data.products[id];

    let average = "Brak ocen";
    if (item.reviews.length != 0) {
      let avg = 0;
      item.reviews.map((r) => {
        avg += r.stars;
      });
      average = (avg / item.reviews.length).toFixed(2);
    }

    res.render("info.hbs", { item: { average: average, ...item } });
  }
});

app.get("/filter", (req, res) => {
  const cat = req.query.cat;
  if (!cat) res.redirect("/");
  else {
    if (cat === "all") {
      res.render("filtered.hbs", { filter: "Wszystkie", items: data.products });
    } else {
      const search = data.products.filter((i) => i.category === cat);

      if (search.length == 0) res.redirect("/");
      else {
        search.forEach((i) => {
          let average = "Brak ocen";
          if (i.reviews.length != 0) {
            let avg = 0;
            i.reviews.map((r) => {
              avg += r.stars;
              console.log(avg);
            });
            average = (avg / i.reviews.length).toFixed(2);
          }

          i.avg = "Ocena: " + average;
        });

        console.log(search);

        res.render("filtered.hbs", { filter: cat, items: search });
      }
    }
  }
});

app.get("/opinions", (req, res) => {
  const id = req.query.id;
  if (!id) res.redirect("/");
  else {
    const item = data.products[id];

    let average = 0;
    let has = false;
    if (item.reviews.length != 0) {
      has = true;

      let avg = 0;
      item.reviews.map((r) => {
        avg += r.stars;
      });

      average = (avg / item.reviews.length).toFixed(2);
    }

    res.render("opinions.hbs", {
      title: item.title,
      hasOpinions: has,
      avg: average,
      opinions: item.reviews,
    });
  }
});

app.get("/addOpinion", (req, res) => {
  const id = req.query.id;
  if (!id) res.redirect("/");
  else {
    const item = data.products[id];
    if (!item) res.redirect("/");
    else {
      res.render("add.hbs", {
        title: item.title,
        id: data.products.indexOf(item),
      });
    }
  }
});

app.post("/newOpinion", (req, res) => {
  const name = req.body.name;
  const content = req.body.content;
  const stars = parseInt(req.body.stars);
  const item = req.body.id;

  const time = new Date();

  data.products[item].reviews.push({
    name: name,
    comment: content,
    stars: stars,
    date: time.getTime(),
  });

  res.redirect("/opinions?id=" + item);
});

app.listen(PORT, () => {
  console.log("Serwer start na porcie" + PORT);
});
