const express = require("express");
const isAuth = require("../middleware/isAuth");
const router = express.Router();
const { check } = require("express-validator");

const adminController = require("../controllers/admin");

router.get("/add-product", isAuth, adminController.getAddProductPage);

router.post(
  "/add-product",
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
  isAuth,
  adminController.postAddProductPage
);

router.get("/products", isAuth, adminController.getProductsPage);

router.get("/edit-product/:id", isAuth, adminController.getEditProductPage);

router.post(
  "/edit-product",
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
  isAuth,
  adminController.postEditProductPage
);

router.post("/delete-product", isAuth, adminController.postDeleteProductPage);

module.exports = router;
