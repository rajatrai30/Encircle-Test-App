const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    socketID: String,
    x: String,
    y: String,
    fcmToken: String, // Add FCM token property
    subjects: [String], // Allow for an array of subjects
    time: String,
    degree: String,
});

const activeUser = mongoose.model('activeUser', userSchema);
const busyUser = mongoose.model('busyUser', userSchema);

module.exports= {activeUser, busyUser};