const axios = require('axios');
const requestData = async () => {
  let data = axios
    .get('https://arcane-mesa-86933.herokuapp.com/api/bot')
    .then((res) => {
      return res;
    })
    .catch((err) => {
      return err;
    });
  return data;
};

module.exports = {
  requestData: requestData,
};
