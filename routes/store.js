const express = require("express");
const router = express.Router();
const path = require("path");

const rootDirectory = require("../util/path");

router.get("/", (req, res) => {
  res.sendFile(path.join(rootDirectory, "views", "store.html"));
});

module.exports = router;
