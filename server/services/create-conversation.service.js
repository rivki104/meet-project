const { sendJoinEmail } = require('./email.service');

const createConversation = (socket, data, io) => {
    const { room } = data;
    console.log('create to room ', room);

    socket.join(room);
    socket.emit('created', room);

}

const joinConversation = (socket, data, io) => {
    const { room } = data;
    console.log('join to room ', room);

    const myRoom = io.sockets.adapter.rooms[room] || { length: 0 };
    const numClients = myRoom.length;
    console.log("num of client on the conversation " + numClients);

    socket.join(room);
    socket.emit('joined', { room });
}

module.exports = {
    createConversation,
    joinConversation,
}
