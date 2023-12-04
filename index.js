const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const { connection } = require("./database/db.js");
const { activeUser } = require("./model/schema.js");
// const admin = require("firebase-admin");
// const servicAccount = require("./ServiceAccount.json");

// Events
const { createChat } = require("./event/createChat.js");
const { messageSend } = require("./event/messageSend.js");
const { onConnection } = require("./event/onConnection.js");
const { onTyping } = require("./event/onTyping.js");
const { onDisconnect } = require("./event/onDisconnect.js");
const {
  handleAcceptConnection,
  sendNotification,
} = require("./event/handleAcceptConnection.js");

dotenv.config();

const PORT = process.env.PORT || 3001;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const FRONTEND_ORIGIN = "https://encircle-test2-app.netlify.app";
// const FRONTEND_ORIGIN = "http://localhost:3000";

app.use(
  cors({
    origin: FRONTEND_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true, // If you need to support cookies or authentication headers
  })
);

const server = http.createServer(app);
connection(DB_USER, DB_PASS);

const io = new Server(server, {
  cors: {
    origin: FRONTEND_ORIGIN,
  },
});

let userCount = 0;

app.use("/server", (req, res) => {
  res.send({ response: "Server running!" }).status(200);
});

io.on("connection", (socket) => {
  const { user, newUserCount } = onConnection(socket, userCount);

  userCount = newUserCount;
  io.emit("user_count", userCount);

  // Handle the store_fcm_token event
  socket.on("store_fcm_token", async (data) => {
    const { fcmToken } = data;
    // Assuming you have a field named 'socketID' to uniquely identify users
    const updatedUser = await activeUser.findOneAndUpdate(
      { socketID: socket.id },
      { $set: { fcmToken: fcmToken } },
      { new: true }
    );
    console.log("FCM token stored:", fcmToken);
    // You can now access the user object, including the stored FCM token
    // console.log("User details:", updatedUser);
  });

  socket.on("create_chat", (data) => createChat(socket, data, user));

  socket.on("accept_connection", (chatRoom) => {
    handleAcceptConnection(socket, chatRoom);
  });

  socket.on("message_send", (data) => messageSend(io, data));

  socket.on("self_typing", (data) => onTyping(io, data));

  socket.on("disconnect", () => {
    userCount = onDisconnect(io, socket, user, userCount);
    io.emit("user_count", userCount);
  });
});

// Deployment
console.log(process.env.NODE_ENV);
if (process.env.NODE_ENV === "production") {
  console.log("Connecting front-end...");
  app.use(express.static("client/build"));
}

server.listen(PORT, () => {
  console.log("Server running on", PORT);
});
