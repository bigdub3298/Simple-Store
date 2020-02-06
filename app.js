const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const { routes: adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/store");

const app = express();

// Set up pug as view engine
app.set("view engine", "pug");
// tell express where to find template files
app.set("views", "views/pug");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "not-found.html"));
});

app.listen(3000);
