const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/cart", shopController.getCartPage);
router.get("/orders", shopController.getOrdersPage);
router.get("/checkout", shopController.getCheckoutPage);
router.get("/products", shopController.getProductsPage);
router.get("/", shopController.getIndexPage);

module.exports = router;
