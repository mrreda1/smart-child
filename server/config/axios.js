const axios = require('axios');

const apiClient = axios.create({
  baseURL: process.env.AI_MODELS_URL,
  timeout: 0,
  headers: {
    'Content-Type': 'application/json',
  },
});

module.exports = { apiClient };
