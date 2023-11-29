const admin = require("firebase-admin");
const serviceAccount = require("../ServiceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const notificationOptions = {
  priority: "high",
  timeToLive: 60 * 60 * 24,
};

const sendNotification = (fcmToken, title, body, image, click_action) => {
  // const fcmToken =
  // "fAdKZe8f7-_7ZTeSOPnBnN:APA91bE35wqp9fhNmaPYi4hHB9flSbpItjUL1oD-_hOUPrCOFvxW0mz8fScSf0qIspn9FgYdgRlq3MVVZD-7-SKyPGkF5ZpTnFVAOVFRK-rbHsvWFm6t8W0MDnzjH6Uols0FEzYK_WIk";

  if (fcmToken) {
    const message = {
      notification: {
        title,
        body,
        image,
        click_action,
      },
    };

    // Check if the fcmToken is a non-empty string
    if (typeof fcmToken === "string" && fcmToken.trim() !== "") {
      const options = notificationOptions;

      console.log("Sending Notification...");
      admin
        .messaging()
        .sendToDevice(fcmToken, message, options) // sendToDevice expects an array of registration tokens
        .then((response) => {
          if (response.results[0].messageId == null) {
            console.log(response.results[0].error);
          } else {
            console.log("notii sent to:", fcmToken);
            console.log(
              "Notification sent successfully with messageId:",
              response.results[0].messageId
            );
          }
        })
        .catch((error) => {
          console.error("Error sending notification:", error);
        });
    } else {
      console.error("Invalid or empty FCM token for socket ID:", fcmToken);
    }
  } else {
    console.error("FCM token not found for socket ID:", fcmToken);
  }
};

module.exports = { sendNotification };
