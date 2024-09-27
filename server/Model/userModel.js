const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "Your first name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Your last name is required"],
  },
  email: {
    type: String,
    required: [true, "Your email address is required"],
    unique: true,
  },
  gender: {
    type: String,
    required: [true, "Your gender is required"],
  },
  city: {
    type: String,
    required: [true, "Your city is required"],
  },
  state: {
    type: String,
    required: [true, "Your state is required"],
  },
  password: {
    type: String,
    required: [true, "Your password is required"],
  },
  channel: {
    type: String,
  },
});

userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 12);
});

module.exports = mongoose.model('User', userSchema);