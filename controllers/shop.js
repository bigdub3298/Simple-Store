const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndexPage = (_, res) => {
  Product.findAll({ order: [["id", "ASC"]] })
    .then(products => {
      res.render("shop/index", {
        products,
        docTitle: "Homepage",
        path: "/"
      });
    })
    .catch(err => console.log(err));
};

exports.getProductsPage = (_, res) => {
  Product.findAll({ order: [["id", "ASC"]] })
    .then(products => {
      res.render("shop/product-list", {
        products,
        docTitle: "Store",
        path: "/products"
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
        path: "/products"
      });
    })
    .catch(err => console.log(err));
};

exports.getCartPage = (req, res) => {
  req.user
    .getCart()
    .then(cart => cart.getProducts())
    .then(products => {
      res.render("shop/cart", {
        docTitle: "Your Cart",
        path: "/cart",
        products
      });
    })
    .catch(err => console.log(err));
};

exports.postCartPage = (req, res) => {
  const { id } = req.body;
  let currentCart;

  req.user
    .getCart()
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

  req.user
    .getCart()
    .then(cart => {
      currentCart = cart;
      return cart.getProducts({ where: { id: id } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(_ => res.redirect("/cart"))
    .catch(err => console.log(err));
};

exports.getOrdersPage = (_, res) => {
  res.render("shop/orders", {
    docTitle: "Your orders",
    path: "/orders"
  });
};

exports.getCheckoutPage = (_, res) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout"
  });
};
