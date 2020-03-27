const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");

const shopController = require("../controllers/shop");

router.get("/cart", isAuth, shopController.getCartPage);
router.post("/cart", isAuth, shopController.postCartPage);
router.post(
  "/cart-delete-product",
  isAuth,
  shopController.postDeleteCartProduct
);
router.get("/orders", isAuth, shopController.getOrdersPage);
router.get("/orders/:id", isAuth, shopController.getInvoice);
router.post("/create-order", isAuth, shopController.postOrdersPage);
router.get("/checkout", isAuth, shopController.getCheckoutPage);
router.get("/products", shopController.getProductsPage);
router.get("/products/:id", shopController.getProductPage);
router.get("/", shopController.getIndexPage);

module.exports = router;
