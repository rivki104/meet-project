const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    group: {
        type: String
    },
    fromGoogleAccount: {
        type: Boolean,
        require: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }
})

module.exports = mongoose.model('Contact', contactSchema)
