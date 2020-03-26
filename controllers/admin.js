const Product = require("../models/product");

const { validationResult } = require("express-validator/check");

exports.getAddProductPage = (req, res) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    product: null,
    editing: false,
    errorMessage: null
  });
};

exports.postAddProductPage = (req, res) => {
  const { title, imageurl, price, description } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      product: { title, imageurl, price, description },
      editing: false,
      errorMessage: errors.array()[0].msg
    });
  }

  req.user
    .createProduct({ title, imageurl, price, description })
    .then(_ => res.redirect("/admin/products"))
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
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
        return res.render("admin/edit-product", {
          docTitle: "Edit Product",
          path: "/admin/edit-product",
          product: null,
          editing: editMode,
          errorMessage: "No product found."
        });
      }

      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        product,
        editing: editMode,
        errorMessage: null
      });
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProductPage = (req, res) => {
  const { title, imageurl, price, description, id } = req.body;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      product: { title, imageurl, price, description, id },
      editing: true,
      errorMessage: errors.array()[0].msg
    });
  }

  req.user
    .getProducts({ where: { id } })
    .then(products => {
      if (products.length === 0) {
        return res.render("admin/edit-product", {
          docTitle: "Edit Product",
          path: "/admin/edit-product",
          product,
          editing: true,
          errorMessage: "No product found."
        });
      }
      const product = products[0];
      product.title = title;
      product.imageurl = imageurl;
      product.price = price;
      product.description = description;
      return product.save().then(_ => res.redirect("/admin/products"));
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
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
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};
