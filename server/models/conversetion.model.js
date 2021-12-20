const mongoose = require('mongoose');

const convarsationSchema = mongoose.Schema({
    roomId: {
        type: String,
        require: true
    },
    createdUserId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        require: true
    },
    participants: {
        type: String,
        require: true
    },
    numOfParticipants: {
        type: Number,
        require: true
    },
    beginDate: {
        type: String,
        require: true
    },
    closeDate: {
        type: String,
        require: true
    },
    duration: {
        type: String,
        require: true
    },
    chat: {
        type: Boolean
    },
    wasConversation: {
        type: Boolean
    },
    wasRecord: {
        type: Boolean,
        require: true,
    },

    // location: {
    //     type: Number,
    //     require: true
    // },
})

module.exports = mongoose.model('Conversation', convarsationSchema)
