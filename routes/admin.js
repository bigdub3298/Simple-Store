const express = require("express");
const isAuth = require("../middleware/isAuth");
const router = express.Router();

const adminController = require("../controllers/admin");

router.get("/add-product", isAuth, adminController.getAddProductPage);

router.post("/add-product", isAuth, adminController.postAddProductPage);

router.get("/products", isAuth, adminController.getProductsPage);

router.get("/edit-product/:id", isAuth, adminController.getEditProductPage);

router.post("/edit-product", isAuth, adminController.postEditProductPage);

router.post("/delete-product", isAuth, adminController.postDeleteProductPage);

module.exports = router;
