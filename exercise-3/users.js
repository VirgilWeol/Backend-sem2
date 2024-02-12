const axios = require('axios');

const userS = async () => {
  try {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error.message);
    return [];
  }
};

module.exports = userS;