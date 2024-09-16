const mongoose = require("mongoose");
const { Schema } = mongoose;


const itemSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
      },
    name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
});


module.exports = mongoose.model("Item", itemSchema);