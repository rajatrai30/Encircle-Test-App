// ... (other imports)
const { sendNotification } = require("./fcm");
const { getFcmTokenBySocketId } = require("../controller/controller");

function handleAcceptConnection(socket, chatRoom) {
  // Your logic to handle the event when the connection is accepted
  // This is where you can send a notification to the first user
  // For example, assuming the first user's socket ID is stored in the variable firstUserSocketId
  const firstUserSocketId = chatRoom;
  const notificationTitle = "Connection Accepted";
  const notificationBody = "Your connection request has been accepted!";
  const fcmToken = getFcmTokenBySocketId(firstUserSocketId);

  if (fcmToken) {
    sendNotification(fcmToken, notificationTitle, notificationBody);
  }
}

module.exports = { handleAcceptConnection, sendNotification };
