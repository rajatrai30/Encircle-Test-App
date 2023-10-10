import io from "socket.io-client";

let SERVER_URL = "https://encircle-test-app.vercel.app/";

console.log("Node environment:", process.env.NODE_ENV)
if (process.env.NODE_ENV !== "production"){
    SERVER_URL = "https://encircle-test-app.vercel.app/";
}

export const socket = io.connect(SERVER_URL);