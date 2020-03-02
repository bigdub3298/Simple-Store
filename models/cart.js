const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart-real.json"
);

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, data) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(data);
      }

      const existingProduct = cart.products.find(product => product.id === id);
      const existingProductIndex = cart.products.findIndex(
        product => product.id === id
      );
      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct, qty: existingProduct.qty + 1 };
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice += +productPrice;
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, data) => {
      if (err) {
        return;
      }

      const updatedCart = { ...JSON.parse(data) };
      const deletedProduct = updatedCart.products.find(
        product => product.id === id
      );

      if (deletedProduct) {
        const productQty = deletedProduct.qty;
        const updatedProducts = updatedCart.products.filter(
          product => product.id !== deletedProduct.id
        );
        updatedCart.products = updatedProducts;
        updatedCart.totalPrice -= productQty * productPrice;

        fs.writeFile(p, JSON.stringify(updatedCart), err => {
          console.log(err);
        });
      }
    });
  }
};
