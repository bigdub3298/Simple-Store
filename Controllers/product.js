let products = []; 

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
  products.push({ title: req.body.title });
  res.redirect("/");
};

exports.getStorePage = (_, res) => {
  // console.log(products);
  // res.sendFile(path.join(rootDirectory, "views", "store.html"));
  res.render("store", {
    products,
    docTitle: "Store",
    // hasProducts: products.length > 0,
    activeProduct: false,
    activeStore: true,
    formCSS: false,
    productCSS: true
  });
}


