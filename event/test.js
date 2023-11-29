// const admin = require("firebase-admin");
// const serviceAccount = require("../ServiceAccount.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const registrationToken =
//   "fAdKZe8f7-_7ZTeSOPnBnN:APA91bG6VGtQej3hcQksaA1Xp62D1SmZ3C3O1c_w6_80w0Tbsl9zuA8otnXnIl9RxPCLYpoRcuC7fdq97IxwtZLgNgVxGL8tal4DZQWzYiNdhdftHGSQDPfsPAIOhp6WKjMOQT01tMiu";

// const message = {
//   data: {
//     score: "850",
//     time: "2:45",
//   },
//   token: registrationToken,
// };

// admin
//   .messaging()
//   .send(message)
//   .then((response) => {
//     // Response is a message ID string.
//     console.log("Successfully sent message:", response);
//   })
//   .catch((error) => {
//     console.log("Error sending message:", error);
//   });
