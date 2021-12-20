const socketIo = require('socket.io');
const { onWebSocketConnection } = require('./routes/socket.route');
let io = socketIo();
const setSocket = () => {
    io.on('connection', (socket) => {
        onWebSocketConnection(socket, io)
    });
}

module.exports = {
    socketServer: (app) => {
        io = socketIo(app);
        setSocket();
    }
};
