const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const cors = require("cors");
const path = require("path");

const { socketServer } = require('./webSocket');
socketServer(http);
const { connectDB } = require('./db');
connectDB();
const userRouter = require('./routes/user.route');
const conversationRouter = require('./routes/conversation.route');
const recordRouter = require('./routes/record.route');
const contactRouter = require('./routes/contact.route');

app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/user', userRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/record', recordRouter);
app.use('/api/contact', contactRouter);

module.exports = {
    app,
    http,
}