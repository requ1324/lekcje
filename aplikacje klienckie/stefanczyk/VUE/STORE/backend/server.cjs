const express = require("express");
const cors = require("cors");
const session = require("express-session");
const app = express();
const PORT = 3000;
const fs = require("fs").promises;
const path = require("path");

const { orderBy } = require("lodash");

const usersFilePath = path.join(__dirname, "users.json");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, //ustawia header access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "haslo",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  }),
);

const data = require("./data.json");

app.get("/promotions", (req, res) => {
  res.json(data);
});

app.get("/promotion/:id", (req, res) => {
  const promotionId = req.params.id;
  const promotion = data.promotions.find((p) => p.id === promotionId);
  if (promotion) {
    res.json(promotion);
  } else {
    res.status(404).json({ message: "Promotion not found" });
  }
});

app.get("/product/:id", (req, res) => {
  const productId = req.params.id;
  const product = data.products.find((p) => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: "Product not found" });
  }
});

app.get("/products", (req, res) => {
  console.log(req.query);
  if (req.query.name || req.query.category || req.query._sort) {
    const name = req.query.name ? req.query.name.toLowerCase() : null;
    const category = req.query.category ? req.query.category : null;
    const sort = req.query._sort ? req.query._sort : null;

    let filteredProducts = data.products;
    let sortedProducts;

    if (name) {
      filteredProducts = filteredProducts.filter((p) =>
        p.name.toLowerCase().includes(name),
      );
    }

    if (category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === category,
      );
    }

    if (sort) {
      if (sort == "name_asc") {
        sortedProducts = orderBy(filteredProducts, ["name"], ["asc"]);
      } else if (sort == "name_desc") {
        sortedProducts = orderBy(filteredProducts, ["name"], ["desc"]);
      } else if (sort == "price_asc") {
        sortedProducts = orderBy(filteredProducts, ["price"], ["asc"]);
      } else if (sort == "price_desc") {
        sortedProducts = orderBy(filteredProducts, ["price"], ["desc"]);
      }
    }

    res.json(sortedProducts);
  } else {
    res.json(data.products);
  }
});

app.post("/createUser", async (req, res) => {
  let usersData = {
    email: req.body.email,
    password: req.body.password,
  };
  const data = await fs.readFile(usersFilePath, "utf8");
  const usersArray = JSON.parse(data);

  const emailExists = usersArray.some((user) => user.email === usersData.email);

  if (emailExists) {
    return res.status(400).json({ status: "email already exists" });
  } else {
    usersArray.push(usersData);

    await fs.writeFile(
      usersFilePath,
      JSON.stringify(usersArray, null, 2),
      "utf8",
    );
    res.json({ status: "registered" });
  }
});

app.post("/loginUser", async (req, res) => {
  const { email, password } = req.body;
  const data = await fs.readFile(usersFilePath, "utf8");
  const usersArray = JSON.parse(data);

  const user = usersArray.find(
    (u) => u.email === email && u.password === password,
  );
  if (user) {
    req.session.username = user.email.split("@")[0];
    console.log(req.session.username);
    res.json({ status: "logged in", email: user.email });
  } else {
    res.status(401).json({ status: "invalid credentials" });
  }
});

app.post("/logoutUser", async (req, res) => {
  req.session.destroy();
  res.json({ status: "logged out" });
});

app.get("/getCurrentUser", async (req, res) => {
  if (req.session.username) {
    res.json({ username: req.session.username });
  } else {
    res.status(401).json({ status: "not authenticated" });
  }
});

app.get("/categories", (req, res) => {
  const categories = data.categories;
  console.log(categories);
  res.json(categories);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
