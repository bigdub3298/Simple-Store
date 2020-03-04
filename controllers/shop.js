const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getIndexPage = (_, res) => {
  Product.findAll({ order: [["id", "ASC"]] })
    .then(products => {
      res.render("shop/index", {
        products,
        docTitle: "Homepage",
        path: "/"
      });
    })
    .catch(err => console.log(err));
};

exports.getProductsPage = (_, res) => {
  Product.findAll({ order: [["id", "ASC"]] })
    .then(products => {
      res.render("shop/product-list", {
        products,
        docTitle: "Store",
        path: "/products"
      });
    })
    .catch(err => console.log(err));
};

exports.getProductPage = (req, res) => {
  const { id } = req.params;
  Product.findByPk(id)
    .then(product => {
      res.render("shop/product-detail", {
        product,
        docTitle: "Product Detail",
        path: "/products"
      });
    })
    .catch(err => console.log(err));
};

exports.getCartPage = (_, res) => {
  Cart.getCart(cart => {
    Product.findAll()
      .then(products => {
        const cartProducts = [];
        for (product of products) {
          const cartProductData = cart.products.find(
            prod => prod.id === product.id
          );
          if (cartProductData) {
            cartProducts.push({
              productData: product,
              qty: cartProductData.qty
            });
          }
        }
        res.render("shop/cart", {
          docTitle: "Your Cart",
          path: "/cart",
          products: cartProducts
        });
      })
      .catch(err => console.log(err));
  });
};

exports.postCartPage = (req, res) => {
  const { id } = req.body;
  Product.findByPk(id)
    .then(product => {
      Cart.addProduct(product.id, product.price);
      res.redirect("/");
    })
    .catch(err => console.log(err));
};

exports.postDeleteCartProduct = (req, res) => {
  const { id } = req.body;
  Product.fetchByPk(id)
    .then(product => {
      Cart.deleteProduct(product.id, product.price);
      res.redirect("/cart");
    })
    .catch(err => console.log(err));
};

exports.getOrdersPage = (_, res) => {
  res.render("shop/orders", {
    docTitle: "Your orders",
    path: "/orders"
  });
};

exports.getCheckoutPage = (_, res) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout"
  });
};
