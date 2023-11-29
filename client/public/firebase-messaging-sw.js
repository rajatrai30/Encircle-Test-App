// Scripts for firebase and firebase messaging
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDIcpw40S3k9ev4dj4YaIQbp63pDnbM6e8",
  authDomain: "advance-nuance-391208.firebaseapp.com",
  projectId: "advance-nuance-391208",
  storageBucket: "advance-nuance-391208.appspot.com",
  messagingSenderId: "386237428641",
  appId: "1:386237428641:web:dd4dbb065e11ba252291e0",
  measurementId: "G-S8PVDLDDMZ",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon,
    image: payload.notification.image,
    data:{
      time: new Date(Date.now()).toString(),
      click_action: payload.notification.click_action
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});


// Handle notification click
self.addEventListener('notificationclick', function(event) {
  var action_click=event.notification.data.click_action;
  event.notification.close();

  event.waitUntil(
    clients.openWindow(action_click)
  );
});

// Handle incoming messages. Called when:
// - a message is received while the app has focus
messaging.onMessage((payload) => {
  console.log("Message received. ", payload);
});

// messaging.onNotification((payload) => {
//   console.log("Notification received in foreground", payload);
//   // Handle the notification here
// });
