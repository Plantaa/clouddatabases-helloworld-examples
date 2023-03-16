const fs = require("fs")
const { MongoClient } = require("mongodb")

const config = require("./config.json");
const uri = config.connectionString;

const certFile = "./mongo.cert"

module.exports = async function () {

  // create a connection to the database
  const opts = {
    tls: true,
    tlsCAFile: certFile,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    replicaSet: "replset"
  }
  const client = new MongoClient(uri, opts)
  await client.connect()

  console.log("Connected!")

  return client
}