const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authentication");

const shopController = require("../controllers/shop");

router.get("/cart", authenticate, shopController.getCartPage);
router.post("/cart", authenticate, shopController.postCartPage);
router.post(
  "/cart-delete-product",
  authenticate,
  shopController.postDeleteCartProduct
);
router.get("/orders", authenticate, shopController.getOrdersPage);
router.get("/orders/:id", authenticate, shopController.getInvoice);
router.get("/checkout", authenticate, shopController.getCheckoutPage);
router.get(
  "/checkout/success",
  authenticate,
  shopController.getCheckoutSuccess
);
router.get("/checkout/cancel", authenticate, shopController.getCheckoutPage);
router.get("/products", shopController.getProductsPage);
router.get("/products/:id", shopController.getProductPage);
router.get("/", shopController.getIndexPage);

module.exports = router;
