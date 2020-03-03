const db = require("../database");
const Cart = require("./cart");

module.exports = class Product {
  constructor(title, imageURL, description, price, id = null) {
    this.id = id;
    this.title = title;
    this.imageURL = imageURL;
    this.description = description;
    this.price = price;
  }

  save() {}

  static async fetchAllProducts() {
    return db.query("SELECT * FROM products");
  }

  static fetchProductWithId(id) {}

  static deleteProductWithId(id) {}
};
