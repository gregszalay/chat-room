const MongoClient = require('mongodb').MongoClient
const connectionString = 'mongodb://127.0.0.1:27017'

const usernamesToSocketIds = new Map();


function getSocketConnectionsMap(){
  return usernamesToSocketIds;
}



//Saves one message, returns a Promise
function saveMessage(nickname, message) {
  return connectToDB()
  .then(db => {return db.collection("messages").insertOne({ nickName: nickname, message: message })})
  .catch(error => {console.log(error)})

}

//Loads new messages, returns a Promise
function getNewMessages(numberOfMessages) {
  return connectToDB()
  .then(db => {return findAllMessagesNewestToOldest(db, numberOfMessages)})
  .catch(error => {console.log(error)})
  
}

//Loads messages before a given message, returns a Promise
function getOldMessages(numberOfMessages, earliestLoadedMessage) {
  return connectToDB()
  .then(db => {return findAllMessagesBeforeTimeStampNewestToOldest(db, numberOfMessages, earliestLoadedMessage)})
  .catch(error => {console.log(error)})
  
}

//Connects to db, returns a promise
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

//QUERY METHODS:

async function getTimeStampFromId(db, _id) {
  const cursor = db.collection("messages")
  .find()
  .sort({ '_id': _id })
  .limit(1);
  timeStampArray = await cursor.toArray(); 
  timeStamp = timeStampArray[0]._id.getTimestamp();
  return timeStamp;
}

async function findAllMessagesNewestToOldest(db, count) {
  const cursor = db.collection("messages")
    .find({})
    .sort({
      _id: -1
    })
    .limit(count);
  
  const loadedMessages = await cursor.toArray(); 
  console.log("typeof messages originally: " + typeof loadedMessages);
  //console.log(loadedMessages); 
  return loadedMessages;
}

async function findAllMessagesBeforeTimeStampNewestToOldest(db, count, earliestLoadedMessage) {
  let timeStamp = getTimeStampFromId(db, earliestLoadedMessage._id);
  const cursor = db.collection("messages")
      .find({
        timestamp: {
          $lt: timeStamp
        }
      })
      .sort({
        _id: -1
      })
      .limit(count)
    const loadedMessages = await cursor.toArray(); 
    console.log("typeof messages originally: " + typeof messages);
   return loadedMessages;

}


module.exports = { saveMessage, getNewMessages, getOldMessages, getTimeStampFromId , getSocketConnectionsMap};
