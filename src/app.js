const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/auth');

const app = express();

// MongoDB connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/medlink';
mongoose
  .connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(express.json());
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the Express Server!');
});

module.exports = app;
