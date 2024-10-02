const express = require('express');
const app = express();
const mongoose = require("mongoose");
const PORT = 4000;
require('dotenv').config();
const cors = require("cors");
const { MONGO_URL } = process.env;
const Item = require("./Model/itemModel");
const Order = require("./Model/orderModel");
const User = require("./Model/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userOrder = require("./Model/userOrderModel");
const { requireAuth } = require('./Middleware/authMiddleware');

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB is  connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static('public/images'));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://zedcommerce.vercel.app", "https://zacracproject-v2.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

const createSecretToken = ({_id, firstName}) => {  
  return jwt.sign({_id, firstName}, process.env.TOKEN_KEY, { 
    expiresIn: '30d',
  });
}

app.post('/api/additems', async (req, res) => {
  try {
    const { image, name, price } = req.body;
    const newItem = new Item({
      image,
      name,
      price
    });
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/itemlist', async (req, res) => {
  try {
    const items = await Item.find(); 
    res.json(items);  
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/orderitem', async (req, res) => {
  try {
    const { name, gender, city, state, address, itemName, itemImage, price, quantity, channel } = req.body;
    const newOrder = new Order({
      name, gender, city, state, address, itemName, itemImage, price, quantity, channel
    });
    const savedOrder = await newOrder.save();
    res.status(201).json({ message: "Order placed successfully", success: true, savedOrder });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/register', async (req, res, next) => {
  try {
    const { firstName, lastName, email, gender, city, state, password, channel } = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.json({ message: "Email already in use. Please use another email." });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }
    const newUser = new User({
      firstName, lastName, email, gender, city, state, password, channel
    });
    const savedUser = await newUser.save();
    const token = createSecretToken({_id:savedUser._id, firstName:savedUser.firstName})
    res.status(201).json({ message: "User registered successfully!", success: true, token, firstName: savedUser.firstName, lastName: savedUser.lastName, email: savedUser.email });
    next()
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const savedUser = await User.findOne({ email });
      if(!savedUser){
        return res.json({message:'Incorrect email' }) 
      }
      const savedPass = await bcrypt.compare(password, savedUser.password)
      if (!savedPass) {
        return res.json({message:'Incorrect password. Please try again.' }) 
      }
    const token = createSecretToken({_id:savedUser._id, firstName:savedUser.firstName})
    res.status(200).json({ message: "Login successful!", success: true, token, firstName: savedUser.firstName, lastName: savedUser.lastName, email: savedUser.email });
    next()
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/orderproduct', requireAuth, async (req, res, next) => {
  try {
    const { productId, price, quantity, totalPrice } = req.body;
    const { _id } = req.savedUser;
    const newUserOrder = new userOrder({
      productId, price, quantity, totalPrice, customerId:_id
    });
    const savedUserOrder = await newUserOrder.save();
    res.status(201).json({ message: "Order successful!", success: true, savedUserOrder });
    next()
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});