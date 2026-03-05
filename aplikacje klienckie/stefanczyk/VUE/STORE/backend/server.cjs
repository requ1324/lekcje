const express = require("express");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(cors());
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

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
