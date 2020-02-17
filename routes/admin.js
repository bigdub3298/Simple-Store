const express = require("express");
const router = express.Router();

const productsController = require('../Controllers/product');

router.get("/add-product", productsController.getAddProductPage);

router.post("/add-product", productsController.postAddProductPage);

exports.routes = router;
