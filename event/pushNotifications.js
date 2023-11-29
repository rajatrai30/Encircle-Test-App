// // In a separate file, e.g., pushNotifications.js
// const admin = require("firebase-admin");

// const sendPushNotification = async (receiverToken) => {
//   const message = {
//     data: {
//       title: "New Connection Request",
//       body: "Someone is trying to connect with you!",
//     },
//     token: receiverToken,
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     console.log("Successfully sent message:", response);
//   } catch (error) {
//     console.error("Error sending message:", error);
//   }
// };

// module.exports = { sendPushNotification };


const admin = require("firebase-admin");
const serviceAccount = require("path/to/your/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Replace 'YOUR_FCM_TOKEN' with the actual FCM token you want to send the message to
const registrationToken = 'YOUR_FCM_TOKEN';

const message = {
  data: {
    key1: 'value1',
    key2: 'value2',
  },
  token: registrationToken,
};

admin.messaging().send(message)
  .then((response) => {
    console.log('Successfully sent message:', response);
  })
  .catch((error) => {
    console.log('Error sending message:', error);
  });

