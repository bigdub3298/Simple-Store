const fs = require("fs");
const path = require("path");
const pdfDocument = require("pdfkit");

const Product = require("../models/product");
const Order = require("../models/order");

exports.getIndexPage = (req, res, next) => {
  Product.findAll({ order: [["id", "ASC"]] })
    .then(products => {
      res.render("shop/index", {
        products,
        docTitle: "Homepage",
        path: "/"
      });
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProductsPage = (req, res, next) => {
  Product.findAll({ order: [["id", "ASC"]] })
    .then(products => {
      res.render("shop/product-list", {
        products,
        docTitle: "Store",
        path: "/products"
      });
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProductPage = (req, res, next) => {
  const { id } = req.params;
  Product.findByPk(id)
    .then(product => {
      res.render("shop/product-detail", {
        product,
        docTitle: "Product Detail",
        path: "/products"
      });
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCartPage = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => cart.getProducts())
    .then(products => {
      res.render("shop/cart", {
        docTitle: "Your Cart",
        path: "/cart",
        products
      });
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.postCartPage = (req, res, next) => {
  const { id } = req.body;
  let currentCart;

  req.user
    .getCart()
    .then(cart => {
      currentCart = cart;
      return cart.getProducts({ where: { id: id } });
    })
    .then(products => {
      const DEFAULT_QUANTITY = 1;
      let product;
      if (products.length > 0) {
        product = products[0];
      }

      if (product) {
        const newQuantity = product.cartItem.quantity + DEFAULT_QUANTITY;
        return currentCart.addProduct(product, {
          through: { quantity: newQuantity }
        });
      }
      return Product.findByPk(id).then(product =>
        currentCart.addProduct(product, {
          through: { quantity: DEFAULT_QUANTITY }
        })
      );
    })
    .then(_ => {
      res.redirect("/");
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.postDeleteCartProduct = (req, res, next) => {
  const { id } = req.body;

  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: id } });
    })
    .then(products => {
      const product = products[0];
      return product.cartItem.destroy();
    })
    .then(_ => res.redirect("/cart"))
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrdersPage = (req, res, next) => {
  req.user
    .getOrders({ include: "products" })
    .then(orders => {
      res.render("shop/orders", {
        docTitle: "Your orders",
        path: "/orders",
        orders
      });
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.postOrdersPage = (req, res, next) => {
  let currentCart;

  req.user
    .getCart()
    .then(cart => {
      currentCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user
        .createOrder()
        .then(order =>
          order.addProducts(
            products.map(product => {
              product.orderItem = { quantity: product.cartItem.quantity };
              return product;
            })
          )
        )
        .catch(err => console.log(err));
    })
    .then(_ => currentCart.setProducts(null))
    .then(result => {
      res.redirect("/orders");
    })
    .catch(err => {
      const error = new Error(err);
      err.httpStatusCode = 500;
      return next(error);
    });
};

exports.getInvoice = (req, res, next) => {
  const { id } = req.params;
  Order.findOne({ where: { id }, include: "products" })
    .then(order => {
      if (!order) {
        return next(new Error("No order found"));
      }

      if (order.userId !== req.user.id) {
        return next(new Error("Unauthorized"));
      }

      const invoiceName = `Invoice-${id.toString().padStart(5, "0")}.pdf`;
      const doc = new pdfDocument();
      res.setHeader("Content-Disposition", `inline; filename=${invoiceName}`);
      res.setHeader("Content-Type", "application/pdf");
      doc.pipe(res);

      const dateFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric"
      };

      doc
        .fillColor("grey")
        .lineGap(1)
        .fontSize(20)
        .text(`Invoice #${id.toString().padStart(5, "0")}`)
        .fontSize(12)
        .text(
          `Date: ${new Date(order.createdAt).toLocaleDateString(
            undefined,
            dateFormatOptions
          )}`
        )
        .text(`User ID: ${order.userId}`)
        .text("------------------------------------------------------")
        .moveDown()
        .fillColor("black")
        .fontSize(20)
        .text("Order Items:")
        .fontSize(12)
        .list(
          order.products.map(
            product =>
              `${product.title} - ${product.orderItem.quantity} x $${product.price}`
          )
        )
        .moveDown()
        .text("------------------------------------------------------")
        .text(
          `Total: $${order.products.reduce(
            (accum, product) =>
              accum + product.price * product.orderItem.quantity,
            0
          )}`
        )
        .end();
    })
    .catch(err => next(err));
};

exports.getCheckoutPage = (req, res, next) => {
  res.render("shop/checkout", {
    docTitle: "Checkout",
    path: "/checkout"
  });
};
