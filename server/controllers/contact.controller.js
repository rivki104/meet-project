const Contact = require('../models/contact.model');
const User = require('../models/user.model');
const axios = require('axios');

const passUserToken = (req, res) => {
    axios.get(`https://people.googleapis.com/v1/people/me/connections?personFields=emailAddresses,names,photos&access_token=${req.params.token}`)
        .then((data) => {
            res.status(200).send(data.data.connections);
        })
        .catch((error) => {
            console.log(error);
        });
}

const addOneContact = async (req, res) => {
    try {
        console.log("from function addOneContact");
        newContact = new Contact({
            email: req.body.email,
            owner: req.body.ownerUserId,
        });
        let ansNewContact = await newContact.save();
        let ansUser = await User.findByIdAndUpdate(req.body.ownerUserId, { $push: { 'additionalContacts': ansNewContact._id } })
        console.log("Contact saved successfuly!")
        res.status(200).send(ansUser);
    }
    catch (error) {
        console.log("Can't save this contact with error: " + error);
    }
}

const getAdditionalContacts = async (req, res) => {
    try {
        contacts = await User.findById(req.params.userId).populate('additionalContacts');
        res.status(200).send(contacts);
        console.log(contacts);
    }
    catch (error) {
        console.log("Can't get additional contacts with error: " + error);
    }
}

module.exports = {
    passUserToken,
    addOneContact,
    getAdditionalContacts,
};