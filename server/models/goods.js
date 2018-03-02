let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let productSchema =  new Schema({

  "productId":String,
  "productName":String,
  "productPrice":Number,
  "productImg":String,
  "productNum":String,
  "checked":String
});
module.exports = mongoose.model('Good',productSchema);
