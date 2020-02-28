const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
// const expressHbs = require("express-handlebars");

const { routes: adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/store");
const errorController = require("./controllers/error");

const app = express();

// add handlebar engine
// app.engine("hbs", expressHbs({ defaultLayout: "main", extname: "hbs" }));
// Set up view engine
// app.set("view engine", "pug");
// app.set("view engine", "hbs");

app.set("view engine", "ejs");
// tell express where to find template files
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.getErrorPage);

app.listen(3000);
