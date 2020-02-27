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
  constructor(title, imageURL, description, price) {
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile(products => {
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
    });
  }

  static fetchAllProducts(cb) {
    getProductsFromFile(cb);
  }

  static fetchById(id, cb) {
    getProductsFromFile(products => {
      const product = products.filter(product => product.id === id)[0];
      cb(product);
    });
  }
};
