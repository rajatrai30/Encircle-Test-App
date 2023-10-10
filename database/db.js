const mongoose = require("mongoose")

const connection = async (username, password) => {
    const URL = `mongodb+srv://${username}:${password}@anon1.34df5nd.mongodb.net/?retryWrites=true&w=majority`

    try {
        await mongoose.connect(URL, { useUnifiedTopology: true, useNewUrlParser: true });
        console.log('connection to mongo db established');
    } catch(error) {
        console.log('error occured: ', error.message);
    }
}

module.exports = {connection}