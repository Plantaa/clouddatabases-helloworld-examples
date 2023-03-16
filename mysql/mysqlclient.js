const mysql = require('mysql2/promise');
const fs = require("fs");
const config = require("./config.json");
const host = config.connection.mysql.hosts[0].hostname;
const port = config.connection.mysql.hosts[0].port;
const database = config.connection.mysql.database;
const user = config.connection.mysql.authentication.username;
const password = config.connection.mysql.authentication.password;
const ca = fs.readFileSync('./mysql.cert');

module.exports = async function () {
  const opts = {
    host,
    port,
    database,
    user,
    password,
    ssl: {
      ca
    }
  }

  const client = await mysql.createConnection(opts);

  console.log("Connected!")

  //Now create a table for the words

  const query = 'CREATE TABLE IF NOT EXISTS words (_id SERIAL PRIMARY KEY, word varchar(255), definition varchar(255))'

  const result = await client.query(query)


  return client
}