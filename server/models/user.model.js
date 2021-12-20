const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firebaseId: {
        type: String,
        require: true,
    },
    name: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: false,
    },
    picture: {
        type: String,
        require: false,
    },
    googleProfile: {
        type: Object,
        require: false,
    },
    token: {
        type: String,
        require: true,
    },
    additionalContacts: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'Contact' }
    ],
})

module.exports = mongoose.model('User', userSchema)
