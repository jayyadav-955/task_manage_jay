import axios from 'axios';

const API = axios.create({
  // baseURL: 'http://127.0.0.1:5000', 
  baseURL: 'https://task-manager-backend-gq52.onrender.com',
});

export default API;
