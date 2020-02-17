const express = require("express");
const router = express.Router();

const productController = require('../Controllers/product');

router.get("/", productController.getStorePage);

module.exports = router;
