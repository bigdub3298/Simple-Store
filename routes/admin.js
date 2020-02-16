const express = require("express");
const router = express.Router();
const path = require("path");

const rootDirectory = require("../util/path");

const products = [];

router.get("/add-product", (req, res) => {
  // res.sendFile(path.join(rootDirectory, "views", "add-product.html"));
  res.render("add-product", {
    docTitle: "Add Product",
    activeProduct: true,
    activeStore: false,
    formCSS: true,
    productCSS: false
  });
});

router.post("/add-product", (req, res) => {
  products.push({ title: req.body.title });
  res.redirect("/");
});

exports.routes = router;
exports.products = products;
