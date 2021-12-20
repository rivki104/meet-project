const { createConversation, joinConversation } = require('../services/create-conversation.service');
const { sendJoinEmail } = require('../services/email.service');

const onWebSocketConnection = (socket, io) => {

    console.log('a user connected');

    socket.on('create', (data) => {
        createConversation(socket, data, io);
    });

    socket.on('selectParticipate', (data) => {
        sendJoinEmail(data.emailAddress, data.roomId, data.currentUser.email);
    });

    socket.on('join', (data) => {
        joinConversation(socket, data, io);
    });

    socket.on('ready', function (data) {
        socket.broadcast.to(data).emit('ready', socket.id);
    });

    socket.on('hungUp', function (data) {
        socket.broadcast.to(data.roomId).emit('hungUp');
    });

    socket.on('candidate', function (data) {
        socket.broadcast.to(data.room).emit('candidate', data);
    });

    socket.on('offer', function (data) {
        socket.broadcast.to(data.room).emit('offer', data.sdp);
    });

    socket.on('answer', function (data) {
        socket.broadcast.to(data.room).emit('answer', data.sdp);
    });

    socket.on('toggleAudio', function (data) {
        socket.broadcast.to(data.room).emit('toggleAudio', data.message);
    });

    socket.on('radio', function (data) {
        socket.broadcast.emit('voice', data);
    });
    socket.on('initSend', function (data) {
        console.log('INIT SEND by ' + socket.id + ' for ' + data)
        peers[data].emit('initSend', socket.id)
    })
}

module.exports = {
    onWebSocketConnection,
}