const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Debug logs (optional)
console.log('🚀 Halal Truck Tracker Starting');
console.log('VEHICLE_ID:', process.env.VEHICLE_ID ? '✅' : '❌ MISSING');
console.log('Access Token:', process.env.BOUNCIE_ACCESS_TOKEN ? '✅' : '❌ MISSING');

// GET truck location from Bouncie
app.get('/api/truck-location', async (req, res) => {
  try {
    const response = await axios.post(
      `https://api.bouncie.dev/v1/vehicles/${process.env.VEHICLE_ID}/locations`,
      {}, // no body needed
      {
        headers: {
          Authorization: process.env.BOUNCIE_ACCESS_TOKEN
        }
      }
    );

    const latest = response.data[0];
    res.json({ latitude: latest.lat, longitude: latest.lon });
  } catch (error) {
    console.error('Error fetching truck location:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch truck location',
      details: error.response?.data || error.message
    });
  }
});

// GET full vehicle list from Bouncie
app.get('/api/vehicle-list', async (req, res) => {
  try {
    const response = await axios.get('https://api.bouncie.dev/v1/vehicles', {
      headers: {
        Authorization: process.env.BOUNCIE_ACCESS_TOKEN
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching vehicle list:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch vehicle list',
      details: error.response?.data || error.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Halal Truck Tracker running on port ${PORT}`);
});
