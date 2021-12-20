const mongoose = require('mongoose');

const recordSchema = mongoose.Schema({
    recordUrl: {
        type: String,
        require: true,
    },
    beginDate: {
        type: String,
        require: true,
    },
    finishDate: {
        type: String,
        require: true,
    },
    duration: {
        type: String,
        require: true,
    },
    roomId: {
        type: String,
        require: true,
    },
    conversationId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Conversation'
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    },
})

module.exports = mongoose.model('Record', recordSchema)
