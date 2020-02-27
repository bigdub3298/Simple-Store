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

exports.getProductPage = (req, res) => {
  const { id } = req.params;
  Product.fetchById(id, product => {
    res.render("shop/product-detail", {
      product,
      docTitle: "Product Detail",
      path: "/products"
    });
  });
};

exports.getCartPage = (_, res) => {
  res.render("shop/cart", {
    docTitle: "Cart",
    path: "/cart"
  });
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

exports.getIndexPage = (_, res) => {
  Product.fetchAllProducts(products => {
    res.render("shop/index", {
      products,
      docTitle: "Homepage",
      path: "/"
    });
  });
};
