const Product = require("../models/product");

exports.getAddProductPage = (_, res) => {
  // res.sendFile(path.join(rootDirectory, "views", "add-product.html"));
  res.render("add-product", {
    docTitle: "Add Product",
    activeProduct: true,
    activeStore: false,
    formCSS: true,
    productCSS: false
  });
};

exports.postAddProductPage = (req, res) => {
  const p = new Product(req.body.title);
  p.save();
  res.redirect("/");
};

exports.getStorePage = (_, res) => {
  Product.fetchAllProducts(products => {
    res.render("store", {
      products,
      docTitle: "Store",
      activeProduct: false,
      activeStore: true,
      formCSS: false,
      productCSS: true
    });
  });
};
