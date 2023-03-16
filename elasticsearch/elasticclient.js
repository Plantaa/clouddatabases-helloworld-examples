const { Client } = require('@elastic/elasticsearch');
const fs = require("fs");

const config = require("./config.json");
const node = config.connection.https.composed[0]
const auth = config.connection.https.authentication;

const ca = fs.readFileSync(__dirname + "/elasticsearch.cert", encoding = "utf8");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'   //allow insecure connections.. ok for testing, not good for production!

module.exports = async function () {
  // create a connection to the database

  const opts = {
    node,
    auth,
    tls: {
      ca
    }
  }

  const client = new Client(opts)
  console.log("Connected!")
  try {
    await client.indices.create({
      index: "words"
    })
    console.log("index created")
  } catch (e) {
    console.log("index exists")
    console.log(e);
  }

  return client
}