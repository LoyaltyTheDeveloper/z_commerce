const express = require('express');
const app = express();
const mongoose = require("mongoose");
const PORT = 4000;
require('dotenv').config();
const cors = require("cors");
const { MONGO_URL } = process.env;
const Item = require("./Model/itemModel");


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

app.use(
    cors({
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );
