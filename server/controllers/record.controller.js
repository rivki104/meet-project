const Record = require('../models/record.model');
const Conversation = require('../models/conversetion.model');
const generalService = require('../services/general.service');

const getRecordById = async (req, res) => {
    let id = req.params.id;
    try {
        let ansRecord = await Record.findById(id);
        res.status(200).send(ansRecord);
        console.log("Get record successfuly!");
    }
    catch (error) {
        console.log("Can't get record with error " + error);
    }
}

const getRecordByUserAndConversation = async (req, res) => {
    let userId = req.params.userId, conversationId = req.params.conversationId;
    try {
        // TODO Switch to array
        let ansRecords = await Record.find({ userId: userId, conversationId: conversationId });
        console.log(ansRecords.toString());
        res.status(200).send(ansRecords);
        console.log("Get records successfuly!");
    }
    catch (error) {
        console.log("Can't get record with error " + error);
    }
}

const addOneRecord = async (req, res) => {
    try {
        let ansConversation = await Conversation.findOne({ roomId: req.body.roomId });
        let newRecord = new Record({
            blob: '',
            beginDate: req.body.beginDate,
            finishDate: "0",
            duration: "",
            roomId: req.body.roomId,
            conversationId: ansConversation._id,
            userId: req.body.userId,
        });
        let ansNewRecord = await newRecord.save();
        console.log("Record saved successfuly!")
        res.status(200).send(ansNewRecord);
    }
    catch (error) {
        console.log("Can't save this record with error: " + error);
    }
}

const updateRecordDetails = async (req, res) => {
    let recordAddition = req.body;
    let ansRecord;
    try {
        let currentRecord = await Record.findOne({ roomId: req.params.roomId });
        if (recordAddition.finishDate != null && recordAddition.finishDate != undefined) {
            // recordAddition.finishDate = (Date)(recordAddition.finishDate);
            // let duration = generalService.DifferenceInMinutes((Date)(currentRecord.beginDate), (Date)(recordAddition.finishDate));
            let duration = generalService.getDuration((Date)(currentRecord.beginDate), (Date)(recordAddition.finishDate));
            // let duration = generalService.getDuration(new Date(currentRecord.beginDate), new Date(recordAddition.finishDate));
            let getRecord = await Record.updateOne(currentRecord, { duration: duration, finishDate: recordAddition.finishDate });
            await Record.findByIdAndUpdate(currentRecord._id, {
                $set: {
                    duration: duration,
                    finishDate: recordAddition.finishDate,
                }
            });
        }
        else {
            ansRecord = await Record.updateOne(currentRecord, recordAddition);
        }
        console.log("Record updated successfuly!");
        res.status(200).send(ansRecord);
    }
    catch (error) {
        console.log("Can't update this record with error: " + error);
    }
}

const deleteRecordById = async (req, res) => {
    let id = req.params.id;
    try {
        let delRecord = await Record.findByIdAndDelete(id);
        res.status(200).send(delRecord);
        console.log("Record delete successfuly!");
    }
    catch (error) {
        console.log("Can't delete this record with error " + error);
    }
}

module.exports = {
    getRecordById,
    getRecordByUserAndConversation,
    addOneRecord,
    updateRecordDetails,
    deleteRecordById,
};