const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
// const expressHbs = require("express-handlebars");

const { routes: adminRoutes } = require("./routes/admin");
const shopRoutes = require("./routes/store");

const app = express();

// add handlebar engine
// app.engine("hbs", expressHbs({ defaultLayout: "main", extname: "hbs" }));
// Set up view engine
// app.set("view engine", "pug");
// app.set("view engine", "hbs");

app.set("view engine", "ejs");
// tell express where to find template files
app.set("views", path.join(__dirname, "views", "ejs"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res) => {
  // res.status(404).sendFile(path.join(__dirname, "views", "not-found.html"));
  res.status(404).render("not-found", { docTitle: "Not Found" });
});

app.listen(3000);
