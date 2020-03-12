require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const session = require("express-session");

// Routers
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/store");
const authRoutes = require("./routes/auth");
const errorController = require("./controllers/error");

// Sequelize
const sequelize = require("./database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
  })
);

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
app.use(authRoutes);

app.use(errorController.getErrorPage);

// sets up relationship between users and products
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);

// sets up relationship between users and carts
User.hasOne(Cart);
Cart.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

// Sets up join table between carts and products
Product.belongsToMany(Cart, { through: CartItem });
Cart.belongsToMany(Product, { through: CartItem });

// sets up relationship between user and order
User.hasMany(Order);
Order.belongsTo(User);

// sets up join table between order and products
// Product.belongsToMany(Order, { through: OrderItem });
Order.belongsToMany(Product, { through: OrderItem });

let currentUser;

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
  .then(user => {
    currentUser = user;
    return user.getCart();
  })
  .then(cart => {
    if (!cart) {
      return currentUser.createCart();
    }
    return cart;
  })
  .then(cart => app.listen(3000, () => console.log("Listening on port 3000")))
  .catch(err => console.log(err));
