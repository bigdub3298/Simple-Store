const fs = require("fs");
const path = require("path");

const getProductsFromFile = cb => {
  const p = path.join(
    path.dirname(process.mainModule.filename),
    "data",
    "products-real.json"
  );

  fs.readFile(p, (err, data) => {
    if (err) {
      cb([]);
    } else {
      cb(JSON.parse(data));
    }
  });
};

module.exports = class Product {
  constructor(title, imageURL, description, price, id = null) {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile(products => {
      if (this.id) {
        const updatedProducts = products.map(product =>
          product.id === this.id ? this : product
        );
        fs.writeFile(
          path.join(
            path.dirname(process.mainModule.filename),
            "data",
            "products-real.json"
          ),
          JSON.stringify(updatedProducts),
          err => {
            console.log(err);
          }
        );
      } else {
        this.id = Math.random().toString();
        products.push(this);
        fs.writeFile(
          path.join(
            path.dirname(process.mainModule.filename),
            "data",
            "products-real.json"
          ),
          JSON.stringify(products),
          err => {
            console.log(err);
          }
        );
      }
    });
  }

  static fetchAllProducts(cb) {
    getProductsFromFile(cb);
  }

  static fetchProductWithId(id, cb) {
    getProductsFromFile(products => {
      const product = products.find(product => product.id === id);
      cb(product);
    });
  }

  static deleteProductWithId(id) {
    getProductsFromFile(products => {
      const updatedProducts = products.filter(product => product.id !== id);
      fs.writeFile(
        path.join(
          path.dirname(process.mainModule.filename),
          "data",
          "products-real.json"
        ),
        JSON.stringify(updatedProducts),
        err => {
          console.log(err);
        }
      );
    });
  }
};
