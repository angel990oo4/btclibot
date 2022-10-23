const axios = require('axios');
const requestData = async () => {
  const response = await axios.get(
    'https://arcane-mesa-86933.herokuapp.com/api/bot'
  );
  return response;
};

module.exports = {
  requestData: requestData,
};
