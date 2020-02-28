const Product = require("../models/product");

exports.getAddProductPage = (_, res) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProductPage = (req, res) => {
  const { title, imageURL, price, description } = req.body;

  const product = new Product(title, imageURL, description, price);
  product.save();
  res.redirect("/");
};

exports.getEditProductPage = (req, res) => {
  const { edit: editMode } = req.query;
  if (!editMode) {
    return res.redirect("/");
  }

  const { id } = req.params;
  Product.fetchById(id, product => {
    res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      product,
      editing: editMode
    });
  });
};
exports.postEditProductPage = (req, res) => {
  const { title, imageURL, price, description, id } = req.body;

  const updatedProduct = new Product(title, imageURL, description, price, id);
  updatedProduct.save();
  res.redirect("/admin/products");
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
