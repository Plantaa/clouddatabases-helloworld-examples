const { Etcd3 } = require('etcd3');
const fs = require("fs");
const config = require("./config.json");
const password = config.connection.grpc.authentication.password
const user = config.connection.grpc.authentication.username
const host = config.connection.grpc.hosts[0].hostname
const port = config.connection.grpc.hosts[0].port
const cert = fs.readFileSync("./etcd.cert")
//console.log(cert)

module.exports = async function () {

  // Create auth credentials
  let opts = {
    hosts: [`https://${host}:${port}`],
    auth: {
      username: user,
      password: password
    },
    credentials: {
      rootCertificate: cert
    }
  };

  const client = new Etcd3(opts).namespace("/ibmclouddb/words/");
  console.log("Connected!")

  return client
}