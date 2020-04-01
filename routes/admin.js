const express = require("express");
const authenticate = require("../middleware/authentication");
const router = express.Router();
const { check } = require("express-validator");

const adminController = require("../controllers/admin");

router.get("/add-product", authenticate, adminController.getAddProductPage);

router.post(
  "/add-product",
  authenticate,
  [
    check("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters.")
      .custom((value, { req }) => {
        if (/[^A-Za-z0-9\ ]/.test(value)) {
          throw new Error(
            "Title can only contain letters, numbers, and spaces."
          );
        }
        return true;
      }),
    check("price", "Price must be a decimal number.").isFloat(),
    check("description", "Description must be at least 5 characters.")
      .trim()
      .isLength(5)
  ],
  adminController.postAddProductPage
);

router.get("/products", authenticate, adminController.getProductsPage);

router.get(
  "/edit-product/:id",
  authenticate,
  adminController.getEditProductPage
);

router.post(
  "/edit-product",
  authenticate,
  [
    check("title")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Title must be at least 3 characters.")
      .custom((value, { req }) => {
        console.log(value);
        if (/[^A-Za-z0-9\ ]/.test(value)) {
          throw new Error(
            "Title can only contain letters, numbers, and spaces."
          );
        }
        return true;
      }),
    check("price", "Price must be a decimal number.").isFloat(),
    check("description", "Description must be at least 5 characters.")
      .trim()
      .isLength(5)
  ],

  adminController.postEditProductPage
);

router.post(
  "/delete-product",
  authenticate,
  adminController.postDeleteProductPage
);

module.exports = router;
