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
  constructor(title, imageURl, description, price) {
    this.title = title;
    this.imageURL = imageURl;
    this.description = description;
    this.price = price;
  }

  save() {
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
};
