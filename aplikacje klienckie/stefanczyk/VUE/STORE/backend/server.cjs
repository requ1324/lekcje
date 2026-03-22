const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;
const fs = require("fs").promises;
const path = require("path");

const usersFilePath = path.join(__dirname, "users.json");

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true, //ustawia header access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
