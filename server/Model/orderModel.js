const mongoose = require("mongoose");
const { Schema } = mongoose;


const orderSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
      },
    city: {
        type: String,
        required: true,
      },
    state: {
        type: String,
        required: true,
      },
    address: {
        type: String,
        required: true,
      },
    itemName: {
        type: String,
        required: true,
      },
    itemImage: {
        type: String,
        required: true,
      },
    price: {
        type: Number,
        required: true,
      },
    quantity: {
        type: Number,
        required: true,
      },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


module.exports = mongoose.model("Order", orderSchema);