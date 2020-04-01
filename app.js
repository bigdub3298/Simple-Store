require("dotenv").config();

// express
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const multer = require("./middleware/multer");
const handleError = require("./middleware/error");
const fetchSessionUser = require("./middleware/user");
const responseLocals = require("./middleware/locals");

// session
const { store, configureSession } = require("./util/sessionStore");
const csurf = require("csurf");
const flash = require("connect-flash");

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

const initializeExpress = () => {
  const app = express();

  const csrfProtection = csurf();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(multer.config());
  app.use(express.static(path.join(__dirname, "public")));
  app.use("/images", express.static(path.join(__dirname, "images")));

  app.use(configureSession());
  app.use(csrfProtection);
  app.use(flash());

  app.use(fetchSessionUser);
  app.use(responseLocals);

  app.use("/admin", adminRoutes);
  app.use(shopRoutes);
  app.use(authRoutes);

  app.get("/500", errorController.get500);

  app.use(errorController.get404);

  app.use(handleError);

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

  sequelize
    // .sync({ force: true })
    .sync()
    .then(_ => app.listen(3000, () => console.log("Listening on port 3000")))
    .catch(err => console.log(err));

  store.sync();
};

initializeExpress();
