const User = require('../models/user.model');

const addOneUser = async (req, res) => {
    let newUser, userFromClient = req.body.user;
    try {
        newUser = new User({
            firebaseId: userFromClient.uid,
            name: userFromClient.displayName,
            email: userFromClient.email,
            password: null,
            picture: req.body.additionalUserInfo.profile != undefined ? req.body.additionalUserInfo.profile.picture : null,
            googleProfile: req.body.additionalUserInfo.profile || null,
            token: req.body.credential ? req.body.credential.oauthAccessToken : '',
            additionalContacts: [],
        });
        let ansNewUser = await newUser.save();
        console.log("User saved successfuly!")
        res.status(200).send(ansNewUser);
    }
    catch (error) {
        console.log("Can't save this user with error: " + error);
    }
}

const getOneUser = async (req, res) => {
    let uid = req.params.id;
    try {
        let ansUser = await User.findOne({ firebaseId: uid });
        console.log("User found successfuly!")
        res.status(200).send(ansUser);
    }
    catch (error) {
        console.log("Can't get this user with error: " + error);
    }
}

//NOTE This function has not yet been tested.
const updateUsersContacts = async (req, res) => {
    let userId = req.params.id;
    let contact = req.body.contact;
    try {
        let ansUser = await User.findById(userId);
        ansUser.additionalContacts.push(contact);
        let updatedUser = ansUser.save();
        console.log("User found and updated successfuly!")
        res.status(200).send(updatedUser);
    }
    catch (error) {
        console.log("Can't update this user with error: " + error);
    }
}

module.exports = {
    addOneUser,
    getOneUser,
    updateUsersContacts,
};