const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();  // to use .env file

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());


// Routes
app.use('/contact', require('./routes/contact'));

// MongoDB connection
const uri = process.env.MONGO_URL_ATLAS || process.env.MONGO_URL;

mongoose.connect(uri)
  .then(() => {
    console.log('MongoDB connected successfully');
  }).catch((err) => {
    console.error('MongoDB connection failed:', err);
  });
  
// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
