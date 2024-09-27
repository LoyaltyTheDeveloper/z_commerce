const mongoose = require("mongoose");
const { Schema } = mongoose;


const userOrderSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
    price: {
        type: Number,
        required: true
      },
    quantity: {
        type: Number,
        required: true,
      },
    totalPrice: {
        type: Number,
        required: true,
      },
    customerId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});


module.exports = mongoose.model("userOrder", userOrderSchema);