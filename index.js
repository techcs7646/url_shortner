require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const urlRoutes = require('./routes/urlRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB securely
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Use routes
app.use('/', urlRoutes);

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
