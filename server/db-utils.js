const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb://127.0.0.1:27017'

//Saves one message, returns a Promise of results
function saveMessage(nickname, message) {
  return connectToDB()
  .then(db => {return db.collection("messages").insertOne({ nickName: nickname, message: message })})
  .catch(error => {console.log(error)})

}

//Loads new messages, returns a Promise of results
function getNewMessages(numberOfMessages) {
  return connectToDB()
  .then(db => {return findAllMessagesNewestToOldest(db, numberOfMessages)})
  .catch(error => {console.log(error)})
  
}

//Connects to db, returns a Promise of connection
function connectToDB() {
  const client = new MongoClient(connectionString);
  return new Promise((resolve, reject) => {
    try {
      client.connect();
      const db = client.db("chatdb"); 
      console.log("Connected MongoDB:" + connectionString);
      resolve(db);
    } catch (e) {
      reject(Error('Couldn\'t connect to db'));
      Console.log(Error("Error connecting to database: " + e))
    } 
  })

}

async function findAllMessagesNewestToOldest(db, count) {
  const cursor = db.collection("messages")
    .find({})
    .sort({
      _id: -1
    })
    .limit(count);
  const loadedMessages = await cursor.toArray(); 
  return loadedMessages;

}


module.exports = { saveMessage, getNewMessages};
