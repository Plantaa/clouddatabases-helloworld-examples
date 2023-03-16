const redis = require("redis");
const fs = require("fs");
const config = require("./config.json");

const path_to_certfile = "./redis.cert";
var cert = fs.readFileSync(path_to_certfile, 'utf8');

const uri = config.connection.rediss.composed[0];
module.exports = async function () {
  var opts = {
    url: uri,
    socket: {
      tls: true,
      ca: cert
    }
  }

  // create a connection to the database
  const redisClient = redis.createClient(opts)
  await redisClient.connect();

  console.log("Connected!")

  return redisClient
}

// const client = redis.createClient({
//   host: config.connection.rediss.hosts[0].hostname,
//   port: config.connection.rediss.hosts[0].port,
//   tls: {
//     cert: fs.readFileSync(path_to_certfile, encoding = 'ascii')
//   }
// });