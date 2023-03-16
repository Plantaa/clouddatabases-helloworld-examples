const amqplib = require('amqplib');
const fs = require("fs");
const config = require("./config.json");
const password = config.connection.amqps.authentication.password
const uri = config.connection.amqps.composed[0]
const cert = fs.readFileSync("./rabbitmq.cert")
//console.log(cert)

module.exports = async function () {

  const routingKey = "words";
  const exchangeName = "ibmclouddb";
  const qName = "sample";

  // open connection
  const conn = await amqplib.connect(uri, { ca: [cert] });

  //create channel
  const ch = await conn.createChannel()

  await ch.assertExchange(exchangeName, "direct", { durable: true })
  const q = await ch.assertQueue(qName, { exclusive: false });
  await ch.bindQueue(q.queue, exchangeName, routingKey);


  console.log("Connected!")

  return ch
}