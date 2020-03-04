const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const { routes: adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/store");
const errorController = require("./controllers/error");
const sequelize = require("./database");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.getErrorPage);

sequelize
  .sync()
  .then(_ => {
    app.listen(3000, () => console.log("Listening on port 3000"));
  })
  .catch(err => console.log(err));
