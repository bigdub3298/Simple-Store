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
  product
    .save()
    .then(() => res.redirect("/"))
    .catch(err => console.log(err));
};

exports.getEditProductPage = (req, res) => {
  const { edit: editMode } = req.query;
  if (!editMode) {
    return res.redirect("/");
  }

  const { id } = req.params;
  Product.fetchProductWithId(id)
    .then(({ rows }) => {
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        product: rows[0],
        editing: editMode
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProductPage = (req, res) => {
  const { title, imageURL, price, description, id } = req.body;

  const updatedProduct = new Product(title, imageURL, description, price, id);
  updatedProduct
    .save()
    .then(() => res.redirect("/admin/products"))
    .catch(err => console.log(err));
};

exports.getProductsPage = (_, res) => {
  Product.fetchAllProducts()
    .then(({ rows }) => {
      res.render("admin/products", {
        products: rows,
        docTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProductPage = (req, res) => {
  const { id } = req.body;
  Product.deleteProductWithId(id)
    .then(() => res.redirect("/admin/products"))
    .catch(err => console.log(err));
};
