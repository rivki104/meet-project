const Conversation = require('../models/conversetion.model');
const generalService = require('../services/general.service');

//NOTE This function has not yet been tested.
const getAllConversatios = async (req, res) => {
    try {
        let allConversations = await Conversation.find();
        console.log("Get all conversations successfuly!");
        res.status(200).send(allConversations);
    }
    catch (error) {
        console.log("Can't get conversations with error: " + error);
    }
}
//NOTE This function has not yet been tested.
const getConversationsByUserId = async (req, res) => {
    let userId = req.params.userId;
    try {
        let userConversations = await Conversation.find({ createdUserId: userId });
        console.log("Get user's conversations successfuly!");
        res.status(200).send(userConversations);
    }
    catch (error) {
        console.log("Can't get conversations with error: " + error);
    }
}
const getConversationsByRoomId = async (req, res) => {
    let roomId = req.params.roomId;
    try {
        let userConversations = await Conversation.find({ roomId: roomId });
        console.log("Get user's conversations successfuly!");
        res.status(200).send(userConversations);
    }
    catch (error) {
        console.log("Can't get conversations with error: " + error);
    }
}

const addOneConversation = async (req, res) => {
    let newConversation = new Conversation({
        roomId: req.body.roomId,
        createdUserId: req.body.createdUserId,
        participants: req.body.participants,
        numOfParticipants: req.body.numOfParticipants,
        beginDate: req.body.beginDate,
        closeDate: null,
        duration: "",
        chat: false,
        wasConversation: false,
    });
    try {
        let addedConversation = await newConversation.save();
        console.log("Save conversation successfuly!");
        res.status(200).send(addedConversation);
    }
    catch (error) {
        console.log("Can't save this conversation with error: " + error);
    }
}

const updateConversationDetails = async (req, res) => {
    let roomId = req.params.roomId;
    let conversationAddition = req.body;
    // console.log(conversationAddition);
    let getConversation;
    try {
        let conversation = await Conversation.findOne({ roomId: roomId });
        console.log(conversation);
        if (conversation.closeDate !== null || conversation.closeDate !== undefined)
            getConversation = await Conversation.findOneAndUpdate({ roomId: roomId }, conversationAddition);
        let ansFromAdditionalFunc;
        if (conversationAddition.closeDate != null && conversationAddition.closeDate != undefined) {
            // conversationAddition.closeDate = (Date)(conversationAddition.closeDate);
            getConversation = await Conversation.findOneAndUpdate({ roomId: roomId }, conversationAddition);
            let conver = await Conversation.findOne({ roomId: roomId });
            // let duration = generalService.getDuration(new Date(conver.beginDate), new Date(conver.closeDate));
            // let duration = closeDate.diff(beginDate, 'minutes');
            let duration = generalService.getDuration((Date)(conver.beginDate), (Date)(conver.closeDate));
            let beginTime = conver.closeDate.split(" ")[0];
            let closeTime = conver.beginDate.split(" ")[0];
            let hour = ((Number)(closeTime.split(":")[0]) - (Number)(beginTime.split(":")[0]));
            let minutes = ((Number)(closeTime.split(":")[1]) - (Number)(beginTime.split(":")[1]));
            let seconds = ((Number)(closeTime.split(":")[2]) - (Number)(beginTime.split(":")[2]));
            if (hour < 0)
                hour = hour * -1;
            if (minutes < 0)
                minutes = minutes * -1;
            if (seconds < 0)
                seconds = seconds * -1;
            let duration2 = (hour + ":" + minutes + ":" + seconds);
            console.log("beginDate: " + conver.beginDate + " closeDate: " + conver.closeDate + " duration: " + duration);
            getConversation = await Conversation.updateOne(conver, { duration: duration2 });
            let ansConversation = await Conversation.updateOne(conversation, { beginDate: conversation.beginDate + "", closeDate: conversation.closeDate + "" });
        }
        if (conversationAddition.participants != null || conversationAddition.participants != undefined) {
            let conveParti = await Conversation.findOne({ roomId: roomId });
            // ansFromAdditionalFunc = addParticipants(conversationAddition.participants, getConversation);
            if (typeof (ansFromAdditionalFunc) == Error) {
                throw new Error(error);
            }
        }
        console.log("The conversation found and updated successfuly!");
        res.status(200).send(getConversation);
    }
    catch (error) {
        console.log("Can't update this conversation with error: " + error);
    }
}

const addParticipants = async (newParticipants, currentConversation) => {
    try {
        //TODO In the DB there is something wrong with the participants, we have to correct it!!!
        let length = currentConversation.participants.push(...newParticipants);
        currentConversation.numOfParticipants = length;
        let updatedParticipants = await currentConversation.save();
        console.log("The participants added successfuly!");
        return updatedParticipants;
    }
    catch (error) {
        console.log("Can't add these participants with error: " + error);
        return error;
    }
}

//NOTE This function has not yet been tested.
const deleteConversationById = async () => {

    let id = req.params.id;
    try {
        console.log("in deleteConversationById function!")
        let deleteConversation = await Conversation.findByIdAndDelete(id);
        let createdUserId = deleteConversation.createdUserId;
        let arrConversation = await Conversation.find({ createdUserId: createdUserId });
        console.log("Delete conversation successfuly!");
        res.status(200).send(arrConversation);
    }
    catch (error) {
        console.log("Can't delete conversations with error: " + error);
    }
}

module.exports = {
    getAllConversatios,
    getConversationsByUserId,
    getConversationsByRoomId,
    addOneConversation,
    updateConversationDetails,
    deleteConversationById,
};