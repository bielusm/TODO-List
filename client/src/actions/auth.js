const axios = require('axios');

export const login = async ({ formData }) => {
  try {
    const res = await axios.get('/api/user/login', { ...formData });
    console.log(res);
  } catch (error) {
    console.error(error);
  }
};
