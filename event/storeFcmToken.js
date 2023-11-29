// const { getFcmTokenBySocketId, updateUserFcmToken } = require("../controller/controller");

// const storeFcmToken = async (socket, data) => {
//   try {
//     const { fcmToken } = data;

//     // Assuming you have a field named 'socketID' in your user schema
//     const existingUser = await getFcmTokenBySocketId(socket.id);

//     if (existingUser) {
//       // Update the existing user's FCM token
//       await updateUserFcmToken(socket.id, fcmToken);
//     } else {
//       // Add the user to the database
//       const newUser = {
//         socketID: socket.id,
//         x: "0",
//         y: "0",
//         fcmToken: fcmToken,
//       };
//       // Add any additional logic for adding a new user to the database if needed

//       // Emit a custom event to the client
//       socket.emit("fcm_token_stored", { message: "FCM token stored successfully!" });
//     }
//   } catch (error) {
//     console.error("Error storing FCM token:", error);
//   }
// };

// module.exports = { storeFcmToken };