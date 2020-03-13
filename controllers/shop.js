const Product = require("../models/product");
const User = require("../models/user");

exports.getIndexPage = (req, res) => {
  Product.findAll({ order: [["id", "ASC"]] })
    .then(products => {
      res.render("shop/index", {
        products,
        docTitle: "Homepage",
        path: "/",
        isAuthenticated: req.session.userId
      });
    })
    .catch(err => console.log(err));
};

exports.getProductsPage = (req, res) => {
  Product.findAll({ order: [["id", "ASC"]] })
    .then(products => {
      res.render("shop/product-list", {
        products,
        docTitle: "Store",
        path: "/products",
        isAuthenticated: req.session.userId
      });
    })
    .catch(err => console.log(err));
};

exports.getProductPage = (req, res) => {
  const { id } = req.params;
  Product.findByPk(id)
    .then(product => {
      res.render("shop/product-detail", {
        product,
        docTitle: "Product Detail",
        path: "/products",
        isAuthenticated: req.session.userId
      });
    })
    .catch(err => console.log(err));
};

exports.getCartPage = (req, res) => {
  User.findByPk(req.session.userId)
    .then(user => user.getCart())
    .then(cart => cart.getProducts())
    .then(products => {
      res.render("shop/cart", {
        docTitle: "Your Cart",
        path: "/cart",
        products,
        isAuthenticated: req.session.userId
      });
    })
    .catch(err => console.log(err));
};

exports.postCartPage = (req, res) => {
  const { id } = req.body;
  let currentCart;

  User.findByPk(req.session.userId)
    .then(user => user.getCart())
    .then(cart => {
      currentCart = cart;
      return cart.getProducts({ where: { id: id } });
    })
    .then(products => {
      const DEFAULT_QUANTITY = 1;
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const newQuantity = product.cartItem.quantity + DEFAULT_QUANTITY;
        return currentCart.addProduct(product, {
          through: { quantity: newQuantity }
        });
      }
      return Product.findByPk(id).then(product =>
        currentCart.addProduct(product, {
          through: { quantity: DEFAULT_QUANTITY }
        })
      );
    })
    .then(_ => {
      res.redirect("/");
    })
    .catch(err => console.log(err));
};

exports.postDeleteCartProduct = (req, res) => {
  const { id } = req.body;

  User.findByPk(req.session.userId)
    .then(user => user.getCart())
    .then(cart => {
      return cart.getProducts({ where: { id: id } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(_ => res.redirect("/cart"))
    .catch(err => console.log(err));
};

exports.getOrdersPage = (req, res) => {
  User.findByPk(req.session.userId)
    .then(user => user.getOrders({ include: "products" }))
    .then(orders => {
      res.render("shop/orders", {
        docTitle: "Your orders",
        path: "/orders",
        orders,
        isAuthenticated: req.session.userId
      });
    })
    .catch(err => console.log(err));
};

exports.postOrdersPage = (req, res) => {
  let currentCart;

  User.findByPk(req.session.userId)
    .then(user => user.getCart())
    .then(cart => {
      currentCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.session.user
        .createOrder()
        .then(order =>
          order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          )
        )
        .catch(err => console.log(err));
    })
    .then(_ => currentCart.setProducts(null))
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => console.log(err));
};

exports.getCheckoutPage = (req, res) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout",
    isAuthenticated: req.session.userId
  });
};
