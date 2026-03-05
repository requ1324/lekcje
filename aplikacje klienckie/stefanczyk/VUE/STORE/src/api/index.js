import axios from "axios";

const get = (url) =>
  new Promise((resolve, reject) => {
    setTimeout(
      () => {
        axios
          .get(url)
          .then((response) => {
            console.log("data", response.data);
            resolve(response.data);
          })
          .catch((error) => {
            reject(error);
          });
      },
      500 + Math.random() * 1000,
    );
  });

const getPromotions = () => get("http://localhost:3000/promotions");
const getPromotion = (id) => get(`http://localhost:3000/promotion/${id}`);
const getProduct = (id) => get(`http://localhost:3000/product/${id}`);

export { getPromotions, getPromotion, getProduct };
