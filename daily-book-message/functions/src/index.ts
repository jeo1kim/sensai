/* eslint-disable */
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
// import {Configuration, OpenAIApi} from "openai";


admin.initializeApp(functions.config().firebase);
const firestore = admin.firestore()

// const configuration = new Configuration({
  // organization: "org-T1GRCkKuvk4HWc4NAngjo9LS",
  // apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

exports.bookPubSubv1 = functions.pubsub.topic('getDailyBookMessage').onPublish((message) => {
  // const message = event.data
  //   ? Buffer.from(event.data, 'base64').toString()
  //   : 'Hello, World';
  console.log(message.data);

  var userList: admin.firestore.DocumentData = [];

  // doc is user id
  Promise.resolve(getBookCollection()).then( doc => {
    
    userList  = (doc as admin.firestore.DocumentData[])
  
  });
  userList.forEach((doc: admin.firestore.DocumentData) => {
    doc.id
  })
});

async function getBookCollection() {
  const books: admin.firestore.DocumentData[] = [];
  const snap  = await firestore.collection('book').get()
  snap.forEach(doc => {
    books.push(doc)
  })
  return books;
}


// exports.sensaiChat = functions.firestore
//     .document('chat/{userId}/messages/{messageId}')
//     .onWrite(async (change, context) => {
//         const data = change.after.data();
//         if(data.isFromMe == false) return null;
//         const userInput = data.text;
//         const tone = "Teach me as if I am a seven years old and make the explanation as entertaining as possible.";
//         const prompt = tone + " " + userInput;

//         try {
//             const config = {
//               model: "text-davinci-003",
//               prompt: prompt,
//               temperature: 0.7, // You can adjust the temperature of the generated text
//               max_tokens: 256, // You can adjust the maximum number of tokens
//               top_p: 1, // alternative to sampling with temperature, called nucleus
//               frequency_penalty: 0, // Number between -2.0 and 2.0. Positive values
//               presence_penalty: 0,
//             };

//             const result = await openai.createCompletion(config);
//             const response = result.data.choices[0].text;

//             return admin.firestore().doc('chat/{userId}/messages/' + Date.now).set(
//                 {'text': response,
//                 'createdAt': Date.now,
//                 'userId': "SENSAi",
//                 'username': "SENSAi",
//                 'isFromMe': false
//                 }, {merge: true});

//             return 1;
//         } catch (err) {
//             console.error(err);
//         }

//     });
