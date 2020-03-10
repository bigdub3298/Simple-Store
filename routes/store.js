const express = require("express");
const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/cart", shopController.getCartPage);
router.post("/cart", shopController.postCartPage);
router.post("/cart-delete-product", shopController.postDeleteCartProduct);
router.get("/orders", shopController.getOrdersPage);
router.post("/create-order", shopController.postOrdersPage);
router.get("/checkout", shopController.getCheckoutPage);
router.get("/products", shopController.getProductsPage);
router.get("/products/:id", shopController.getProductPage);
router.get("/", shopController.getIndexPage);

module.exports = router;
