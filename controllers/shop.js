const Product = require("../models/product");

exports.getProductsPage = (_, res) => {
  Product.fetchAllProducts(products => {
    res.render("shop/product-list", {
      products,
      docTitle: "Store",
      path: "/products"
    });
  });
};

exports.getCartPage = (_, res) => {
  res.render("shop/cart.ejs", {
    docTitle: "Cart",
    path: "/cart"
  });
};

exports.getOrdersPage = (_, res) => {
  res.render("shop/orders.ejs", {
    docTitle: "Your orders",
    path: "/orders"
  });
};

exports.getCheckoutPage = (_, res) => {
  res.render("shop/checkout.ejs", {
    docTitle: "Checkout",
    path: "/checkout"
  });
};

exports.getIndexPage = (_, res) => {
  Product.fetchAllProducts(products => {
    res.render("shop/index", {
      products,
      docTitle: "Homepage",
      path: "/"
    });
  });
};
