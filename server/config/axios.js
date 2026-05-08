const axios = require('axios');

const apiClient = axios.create({
  baseURL: process.env.IMAGE_CLASSIFICATION_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = { apiClient };
