const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// Routers
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/store");
const errorController = require("./controllers/error");

// Sequelize
const sequelize = require("./database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, _, next) => {
  User.findByPk(1)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.getErrorPage);

// sets up relationship between users and products
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

// sets up relationship between users and carts
Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasOne(Cart);

// Sets up join table between carts and products
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

sequelize
  // .sync({ force: true })
  .sync()
  .then(_ => User.findByPk(1))
  .then(user => {
    if (!user) {
      return User.create({ name: "Test", email: "test@test.com" });
    }
    return user;
  })
  .then(_ => {
    app.listen(3000, () => console.log("Listening on port 3000"));
  })
  .catch(err => console.log(err));
