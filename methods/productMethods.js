const fs = require("fs");
const { Module } = require("module");

let productMethods = {
  getProducts: function (callback) {
    fs.readFile("./products.json", "utf-8", (err, data) => {
      if (err) {
        console.log("Error... in reading file");
      } else {
        let products;

        if (data.length <= 0) {
          products = [];
        } else {
          products = JSON.parse(data);
        }
        callback(products);
      }
    });
  },

  setProducts: function (products, callback) {
    fs.writeFile("./products.json", JSON.stringify(products), (err) => {
      if (err) {
        console.log("Error...");
      } else {
        console.log("Successfully written file");
        callback();
      }
    });
  },

  getnProducts: function (index, callback) {
    this.getProducts(function (products) {
      callback(products.slice(index, index + 5));
    });
  },
};

module.exports = productMethods;
