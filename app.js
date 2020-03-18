require("dotenv").config();

// express
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// session
const session = require("express-session");
const sequelizeStore = require("connect-session-sequelize")(session.Store);
const db = require("./database");
const csurf = require("csurf");

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

const store = new sequelizeStore({ db, tableName: "userSessions" });

const sessionConfig = {
  secret: process.env.SECRET,
  store,
  resave: false,
  saveUninitialized: false
};

app.use(session(sessionConfig));

const csrfProtection = csurf();

app.use(csrfProtection);

app.use((req, _, next) => {
  if (!req.session.userId) {
    return next();
  }

  User.findByPk(req.session.userId)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.userId;
  res.locals.csrfToken = req.csrfToken();
  next();
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
  .then(_ => app.listen(3000, () => console.log("Listening on port 3000")))
  .catch(err => console.log(err));

store.sync();
