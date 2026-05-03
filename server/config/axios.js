const axios = require('axios');

const apiClient = axios.create({
  baseURL: process.env.IMAGE_CLASSIFICATION_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = { apiClient };
