// import { initializeApp } from "firebase/app";
// import { getMessaging, getToken } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyDIcpw40S3k9ev4dj4YaIQbp63pDnbM6e8",
//   authDomain: "advance-nuance-391208.firebaseapp.com",
//   projectId: "advance-nuance-391208",
//   storageBucket: "advance-nuance-391208.appspot.com",
//   messagingSenderId: "386237428641",
//   appId: "1:386237428641:web:dd4dbb065e11ba252291e0",
//   measurementId: "G-S8PVDLDDMZ",
// };

// function requestPermission() {
//   console.log("Requesting permission...");
//   Notification.requestPermission().then((permission) => {
//     if (permission === "granted") {
//       console.log("Notification permission granted.");
//       const app = initializeApp(firebaseConfig);

//       const messaging = getMessaging(app);
//       getToken(messaging, {
//         vapidKey:
//           "BG7RsoUEPCVeSSN9h8kTzKhKeGOAu2QnlFFneCaXKAf_iW0j_Vs-gGSw9gSt10TyD19H0GIdE65c81xsy44Bnsw",
//       }).then((currentToken) => {
//         if (currentToken) {
//           console.log("currentToken: ", currentToken);
//         } else {
//           console.log("Can not get token");
//         }
//       });
//     } else {
//       console.log("Do not have permission!");
//     }
//   });
// }

// requestPermission();
