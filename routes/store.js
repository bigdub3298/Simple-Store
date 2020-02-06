const express = require("express");
const router = express.Router();
const path = require("path");

const rootDirectory = require("../util/path");
const { products } = require("./admin");

router.get("/", (req, res) => {
  console.log(products);
  res.sendFile(path.join(rootDirectory, "views", "store.html"));
});

module.exports = router;
