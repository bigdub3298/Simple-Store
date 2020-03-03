const fs = require("fs");
const path = require("path");

const p = path.join(
  path.dirname(process.mainModule.filename),
  "data",
  "cart-real.json"
);

module.exports = class Cart {
  static addProduct(productId, productPrice) {
    Cart.getCart(cart => {
      const updatedCart = cart ? { ...cart } : { products: [], totalPrice: 0 };

      const existingProduct = updatedCart.products.find(
        product => product.id === productId
      );

      if (existingProduct) {
        const updatedProducts = updatedCart.products.map(product =>
          product.id === productId
            ? { ...product, qty: product.qty + 1 }
            : product
        );
        updatedCart.products = updatedProducts;
      } else {
        updatedCart.products.push({ id: productId, qty: 1 });
      }
      updatedCart.totalPrice += +productPrice;

      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(productId, productPrice) {
    Cart.getCart(cart => {
      if (cart) {
        const updatedCart = { ...cart };
        const deletedProduct = updatedCart.products.find(
          product => product.id === productId
        );

        if (deletedProduct) {
          const productQty = deletedProduct.qty;
          const updatedProducts = updatedCart.products.filter(
            product => product.id !== productId
          );
          updatedCart.products = updatedProducts;
          updatedCart.totalPrice -= productQty * productPrice;

          fs.writeFile(p, JSON.stringify(updatedCart), err => {
            console.log(err);
          });
        }
      }
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, data) => {
      if (err) {
        cb(null);
      } else {
        cb(JSON.parse(data));
      }
    });
  }
};
