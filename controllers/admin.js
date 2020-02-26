const Product = require("../models/product");

exports.getAddProductPage = (_, res) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product"
  });
};

exports.postAddProductPage = (req, res) => {
  const { title, imageURL, price, description } = req.body;

  const product = new Product(title, imageURL, description, price);
  product.save();
  res.redirect("/");
};

exports.getProductsPage = (req, res) => {
  Product.fetchAllProducts(products => {
    res.render("admin/products", {
      products,
      docTitle: "Admin Products",
      path: "/admin/products"
    });
  });
};
