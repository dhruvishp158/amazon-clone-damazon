const mongoose = require("mongoose");
const { schema } = require("./product");
const Schema = mongoose.Schema;

let CartSchema = new Schema({
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  total: { type: Number, default: 0 },
  items: [
    {
      item: { type: schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
      price: { type: Number, default: 0 },
    },
  ],
});

module.exports = mongoose.model("Cart", CartSchema);
