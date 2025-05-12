const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

// Optional startup debug logs
console.log('🚀 Halal Truck Tracker starting...');
console.log('VEHICLE_ID:', process.env.VEHICLE_ID || '⚠️ Missing');
console.log('Access Token present:', !!process.env.BOUNCIE_ACCESS_TOKEN);

// Route: Live truck location
app.get('/api/truck-location', async (req, res) => {
  try {
    const response = await axios.get('https://api.bouncie.dev/v1/vehicles', {
      headers: {
        Authorization: process.env.BOUNCIE_ACCESS_TOKEN
      }
    });

    const vehicle = response.data[0];
    const { lat, lon } = vehicle.stats.location;

    res.json({ latitude: lat, longitude: lon });
  } catch (error) {
    console.error('❌ Error fetching truck location:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch truck location',
      details: error.response?.data || error.message
    });
  }
});

// Route: Full vehicle list
app.get('/api/vehicle-list', async (req, res) => {
  try {
    const response = await axios.get('https://api.bouncie.dev/v1/vehicles', {
      headers: {
        Authorization: process.env.BOUNCIE_ACCESS_TOKEN
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('❌ Error fetching vehicle list:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Failed to fetch vehicle list',
      details: error.response?.data || error.message
    });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Halal Truck Tracker running on port ${PORT}`);
});
