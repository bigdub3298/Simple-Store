const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getAddProductPage = (_, res) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProductPage = (req, res) => {
  const { title, imageurl, price, description } = req.body;

  Product.create({ title, imageurl, price, description })
    .then(result => {
      console.log(result);
    })
    .catch(err => console.log(err));
};

exports.getEditProductPage = (req, res) => {
  const { edit: editMode } = req.query;
  if (!editMode) {
    return res.redirect("/");
  }

  const { id } = req.params;
  Product.findByPk(id)
    .then(product => {
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        product,
        editing: editMode
      });
    })
    .catch(err => console.log(err));
};

exports.postEditProductPage = (req, res) => {
  const { title, imageurl, price, description, id } = req.body;

  Product.findByPk(id)
    .then(product => {
      product.title = title;
      product.imageurl = imageurl;
      product.price = price;
      product.description = description;
      return product.save();
    })
    .then(_ => res.redirect("/admin/products"))
    .catch(err => console.log(err));
};

exports.getProductsPage = (_, res) => {
  Product.findAll({ order: [["id", "ASC"]] })
    .then(products => {
      res.render("admin/products", {
        products,
        docTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(err => console.log(err));
};

exports.postDeleteProductPage = (req, res) => {
  const { id } = req.body;
  Product.findByPk(id)
    .then(product => {
      Cart.deleteProduct(product.id, product.price);
      return product.destroy();
    })
    .then(_ => res.redirect("/admin/products"))
    .catch(err => console.log(err));
};
