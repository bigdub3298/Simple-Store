const express = require("express");
const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/add-product", adminController.getAddProductPage);

router.get("/products", adminController.getProductsPage);

router.post("/add-product", adminController.postAddProductPage);

exports.routes = router;
