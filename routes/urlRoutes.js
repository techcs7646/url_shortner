const express = require('express');
const axios = require('axios');
const Url = require('../models/Url');

const router = express.Router();

// Bitly API credentials
const BITLY_ACCESS_TOKEN = '6a88259925c0012cbb00625792b8ae3d1e6dffa9';

// Route to create a short URL using Bitly
router.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;

  try {
    let url = await Url.findOne({ originalUrl });

    if (url) {
      return res.json(url);
    }

    // Generate a short URL using Bitly API
    const response = await axios.post(
      'https://api-ssl.bitly.com/v4/shorten',
      { long_url: originalUrl },
      {
        headers: { Authorization: `Bearer ${BITLY_ACCESS_TOKEN}` }
      }
    );

    const shortUrl = response.data.link; // Get short URL from Bitly response

    // Save to database
    url = new Url({ originalUrl, shortUrl });
    await url.save();

    res.json(url);
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

// Route to redirect to the original URL
router.get('/:shortUrl', async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: `https://${req.params.shortUrl}` });

    if (url) {
      return res.redirect(url.originalUrl);
    } else {
      return res.status(404).json('No URL found');
    }
  } catch (err) {
    console.error(err);
    res.status(500).json('Server error');
  }
});

module.exports = router;
