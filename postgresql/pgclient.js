const { Client, Pool } = require('pg')
const fs = require("fs")

const env = require("./config.json");
const password = env.connection.postgres.authentication.password;
const username = env.connection.postgres.authentication.username;
const uri = env.connection.postgres.composed[0].split("?")[0];
const cert = env.connection.postgres.certificate.certificate_authority
const ca64 = env.connection.postgres.certificate.certificate_base64
// const cert = config.connection.postgres.certificate.certificate_authority;
const path_to_certfile = "./postgresql.cert";
var ca = fs.readFileSync(path_to_certfile, 'utf8');

module.exports = async function () {

  const client = new Client({
    connectionString: uri,
    ssl: {
      ca,
      rejectUnauthorized: true
    }
  })

  await client.connect()

  console.log("Connected!")

  //Now create a table for the words

  const query = 'CREATE TABLE IF NOT EXISTS words (_id SERIAL PRIMARY KEY, word varchar(255), definition varchar(255))'

  await client.query(query)

  console.log("table created")

  return client
}