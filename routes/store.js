const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/cart", shopController.getCartPage);
router.post("/cart", shopController.postCartPage);
router.get("/orders", shopController.getOrdersPage);
router.get("/checkout", shopController.getCheckoutPage);
router.get("/products", shopController.getProductsPage);
router.get("/products/:id", shopController.getProductPage);
router.get("/", shopController.getIndexPage);

module.exports = router;
