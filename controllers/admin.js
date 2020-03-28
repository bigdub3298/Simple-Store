const Product = require("../models/product");

const { validationResult } = require("express-validator");

exports.getAddProductPage = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    product: null,
    editing: false,
    errorMessage: null
  });
};

exports.postAddProductPage = (req, res, next) => {
  const {
    body: { title, price, description },
    file: image
  } = req;

  if (!image) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      product: { title, price, description },
      editing: false,
      errorMessage: "Attached file is not an image."
    });
  }

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      product: { title, price, description },
      editing: false,
      errorMessage: errors.array()[0].msg
    });
  }

  req.user
    .createProduct({ title, image: image.path, price, description })
    .then(_ => res.redirect("/admin/products"))
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProductPage = (req, res, next) => {
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
        return res.status(422).render("admin/edit-product", {
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

exports.postEditProductPage = (req, res, next) => {
  const {
    body: { title, price, description, id },
    file: image
  } = req;

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      docTitle: "Edit Product",
      path: "/admin/edit-product",
      product: { title, price, description, id },
      editing: true,
      errorMessage: errors.array()[0].msg
    });
  }

  req.user
    .getProducts({ where: { id } })
    .then(products => {
      if (products.length === 0) {
        return res.status(422).render("admin/edit-product", {
          docTitle: "Edit Product",
          path: "/admin/edit-product",
          product,
          editing: true,
          errorMessage: "No product found."
        });
      }
      const product = products[0];
      product.title = title;
      if (image) {
        product.image = image.path;
      }
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

exports.getProductsPage = (req, res, next) => {
  const PRODUCTS_PER_PAGE = 1;
  const page = req.query.page || 1;

  let totalProducts;

  Product.count({ where: { userId: req.user.id } })
    .then(count => {
      totalProducts = count;
      return Product.findAll({
        where: { userId: req.user.id },
        offset: (page - 1) * PRODUCTS_PER_PAGE,
        limit: PRODUCTS_PER_PAGE,
        order: [["id", "ASC"]]
      });
    })
    .then(products => {
      res.render("shop/product-list", {
        products,
        docTitle: "Admin Products",
        path: "/admin/products",
        currentPage: +page,
        hasPreviousPage: +page > 2,
        hasNextPage: +page * PRODUCTS_PER_PAGE < totalProducts - 1,
        lastPage: Math.ceil(totalProducts / PRODUCTS_PER_PAGE)
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      next(err);
    });

  // req.user
  //   .getProducts({ order: [["id", "ASC"]] })
  //   .then(products => {
  //     res.render("admin/products", {
  //       products,
  //       docTitle: "Admin Products",
  //       path: "/admin/products"
  //     });
  //   })
  //   .catch(err => {
  //     const error = new Error(err);
  //     err.httpStatusCode = 500;
  //     return next(error);
  //   });
};

exports.postDeleteProductPage = (req, res, next) => {
  const { id } = req.body;
  req.user
    .getProducts({ where: { id } })
    .then(products => {
      if (products.length === 0) {
        return res.status(422).render("admin/products", {
          products,
          docTitle: "Admin Products",
          path: "/admin/products"
        });
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
