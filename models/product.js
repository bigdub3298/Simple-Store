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

  save() {
    if (this.id) {
      return db.query(
        "UPDATE products SET title = $1, description = $2, price = $3, imageurl = $4 WHERE id = $5",
        [this.title, this.description, this.price, this.imageURL, this.id]
      );
    }

    return db.query(
      "INSERT INTO products (title, description, price, imageurl) VALUES ($1, $2, $3, $4)",
      [this.title, this.description, this.price, this.imageURL]
    );
  }

  static fetchAllProducts() {
    return db.query("SELECT * FROM products");
  }

  static fetchProductWithId(id) {
    return db.query(`SELECT * FROM products WHERE id = $1`, [id]);
  }

  static deleteProductWithId(id) {
    return db.query(`DELETE FROM products WHERE id = $1`, [id]);
  }
};
