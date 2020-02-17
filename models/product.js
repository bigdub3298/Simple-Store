let products = []; 

module.exports = class Product {
  constructor(t) {
    this.title = t;  
  }

  save() {
    products.push(this);
  }

  static fetchAllProducts() {
    return products; 
  }
}