const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    socketID: String,
    x: String,
    y: String,
    interests: String,
    time: String,
    degree: String,
});

const activeUser = mongoose.model('activeUser', userSchema);
const busyUser = mongoose.model('busyUser', userSchema);

module.exports= {activeUser, busyUser};