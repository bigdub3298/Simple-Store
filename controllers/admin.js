const Product = require("../models/product");

exports.getAddProductPage = (req, res) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false
  });
};

exports.postAddProductPage = (req, res) => {
  const { title, imageurl, price, description } = req.body;

  req.user
    .createProduct({ title, imageurl, price, description })
    .then(_ => res.redirect("/admin/products"))
    .catch(err => console.log(err));
};

exports.getEditProductPage = (req, res) => {
  const { edit: editMode } = req.query;
  if (!editMode) {
    return res.redirect("/");
  }

  const { id } = req.params;
  req.user
    .getProducts({ where: { id: id } })
    .then(products => {
      const product = products[0];

      if (!product) {
        res.redirect("/admin/products");
      }

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

  req.user
    .getProducts({ where: { id } })
    .then(products => {
      if (products.length === 0) {
        return res.redirect("/");
      }
      const product = products[0];
      product.title = title;
      product.imageurl = imageurl;
      product.price = price;
      product.description = description;
      return product.save().then(_ => res.redirect("/admin/products"));
    })
    .catch(err => console.log(err));
};

exports.getProductsPage = (req, res) => {
  req.user
    .getProducts({ order: [["id", "ASC"]] })
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
  req.user
    .getProducts({ where: { id } })
    .then(products => {
      if (products.length === 0) {
        return res.redirect("/admin/products");
      }
      const product = products[0];
      return product.destroy().then(_ => res.redirect("/admin/products"));
    })
    .catch(err => console.log(err));
};
