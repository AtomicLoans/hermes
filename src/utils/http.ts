import Axios from 'axios';

const axios = Axios.create({
  baseURL: process.env.ARBITER_URI,
});

export default axios;
