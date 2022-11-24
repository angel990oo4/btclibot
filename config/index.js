const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  clientId: process.env.CLIENTID,
  guildId: process.env.GUILDID,
  token: process.env.TOKEN,
  dbusername: process.env.DBUSERNAME,
  dbpassword: process.env.DBPASSWORD,
  dbname: process.env.DB,
};
