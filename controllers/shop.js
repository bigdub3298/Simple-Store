const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getProductsPage = (_, res) => {
  Product.fetchAllProducts(products => {
    res.render("shop/product-list", {
      products,
      docTitle: "Store",
      path: "/products"
    });
  });
};

exports.getProductPage = (req, res) => {
  const { id } = req.params;
  Product.fetchProductWithId(id, product => {
    res.render("shop/product-detail", {
      product,
      docTitle: "Product Detail",
      path: "/products"
    });
  });
};

exports.getCartPage = (_, res) => {
  Cart.getCart(cart => {
    Product.fetchAllProducts(products => {
      const cartProducts = [];
      for (product of products) {
        const cartProductData = cart.products.find(
          prod => prod.id === product.id
        );
        if (cartProductData) {
          cartProducts.push({ productData: product, qty: cartProductData.qty });
        }
      }
      res.render("shop/cart", {
        docTitle: "Your Cart",
        path: "/cart",
        products: cartProducts
      });
    });
  });
};

exports.postCartPage = (req, res) => {
  const { id } = req.body;
  Product.fetchProductWithId(id, product => {
    Cart.addProduct(product.id, product.price);
  });
  res.redirect("/");
};

exports.postDeleteCartProduct = (req, res) => {
  const { id } = req.body;
  Product.fetchProductWithId(id, product => {
    Cart.deleteProduct(product.id, product.price);
    res.redirect("/cart");
  });
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

exports.getIndexPage = (_, res) => {
  Product.fetchAllProducts(products => {
    res.render("shop/index", {
      products,
      docTitle: "Homepage",
      path: "/"
    });
  });
};
