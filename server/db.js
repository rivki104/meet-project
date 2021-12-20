const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectionParams = {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}

const connectDB = () => {
    mongoose.connect(process.env.DB_CONNECT, connectionParams)
        .then(() => {
            console.log('MongoDB Connection Succeeded.');
        })
        .catch((error) => {
            console.log('Error in DB connection: ' + error)
        });
}

module.exports = {
    connectDB,
}
