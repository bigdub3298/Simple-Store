const Product = require("../models/product");

exports.getAddProductPage = (_, res) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product"
  });
};

exports.postAddProductPage = (req, res) => {
  const p = new Product(req.body.title);
  p.save();
  res.redirect("/");
};

exports.getProductsPage = (req, res) => {
  res.render("admin/products", {
    docTitle: "Products",
    path: "/admin/products"
  });
};
