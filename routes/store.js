const express = require("express");
const router = express.Router();
const path = require("path");

const rootDirectory = require("../util/path");
const { products } = require("./admin");

router.get("/", (req, res) => {
  // console.log(products);
  // res.sendFile(path.join(rootDirectory, "views", "store.html"));
  res.render("store", {
    products,
    docTitle: "Store",
    // hasProducts: products.length > 0,
    activeProduct: false,
    activeStore: true,
    formCSS: false,
    productCSS: true
  });
});

module.exports = router;
