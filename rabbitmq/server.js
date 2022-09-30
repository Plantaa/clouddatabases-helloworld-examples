/**
 * Copyright 2022 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the “License”);
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an “AS IS” BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Add the express web framework
const express = require("express");
const fs = require("fs");
const app = express();
const RC = require("./rmqclient.js")

const qName = "sample";
const routingKey = "words";
const exchangeName = "ibmclouddb";

// Use body-parser to handle the PUT data
const bodyParser = require("body-parser");
app.use(
  bodyParser.json()
);


// We want to extract the port to publish our app on
let port = process.env.PORT || 8080;

// This is a global variable we'll use for handing the MongoDB client around
let rmq;

// Add a word to the database
async function addWord(message) {
  await rmq.publish(exchangeName, routingKey, Buffer(message));
  let msgTxt = message + " : Message sent at " + new Date();
  console.log(" [+] %s", msgTxt);
  return {}
}

// Get words from the database
async function getWords() {
  const msgOrFalse = await rmq.get(qName, {})
  let result = "No messages in queue";
  if (msgOrFalse !== false) {
    result = msgOrFalse.content.toString() + " : Message received at " + new Date();
    await rmq.ack(msgOrFalse);
  }
  console.log(" [-] %s", result);
  return {ok:true, message:result};

}

// With the database going to be open as some point in the future, we can
// now set up our web server. First up we set it to server static pages
app.use(express.static(__dirname + "/public"));

// The user has clicked submit to add a word and definition to the database
// Send the data to the addWord function and send a response if successful
app.put("/words", async function (request, response) {
  try {
    const resp = await addWord(request.body.message)
    response.send(resp);

  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }

});

// Read from the database when the page is loaded or after a word is successfully added
// Use the getWords function to get a list of words and definitions from the database
app.get("/words", async function (request, response) {
  try {
    const words = await getWords()
    response.send(words);
  } catch (err) {
    console.log(err);
    response.status(500).send(err);
  }
});

// Listen for a connection.
app.listen(port, async function () {
  //make the mongo connection
  rmq = await RC()
  console.log("Server is listening on port " + port);
});
