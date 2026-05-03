import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1/public/youtube',
  headers: {
    'Accept': 'application/json'
  }
});

export default api;
