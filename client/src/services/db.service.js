import axios from 'axios';
import * as socketService from './socket.service'

const addNewConversation = () => {
    const state = window.store.getState();
    if (state.conversationReducer.isCaller) {
        axios.post(
            `${state.generalReducer.serverURL}/conversation/addOneConversation`,
            {
                roomId: state.conversationReducer.roomId,
                createdUserId: state.generalReducer.currentUser._id,
                participants: [state.generalReducer.currentUser],
                numOfParticipants: 1,
                beginDate: moment(new Date()).format('h:mm:ss DD/MM/YYYY') + "",
                wasConversation: false,
            })
            .then(data => {
                console.log("The conversation saved successfuly: " + data);
            })
            .catch(error => {
                console.log("There is an error: " + error);
            });
    }
}

const updateConversationDetails = (additions) => {
    const state = window.store.getState();
    axios.put(
        `${state.generalReducer.serverURL}/conversation/updateConversationDetails/${state.conversationReducer.roomId}`,
        additions)
        .then(data => {
            console.log("The details update successfuly! " + data);
        })
        .catch(error => {
            console.log("There is an error: " + error);
        });
}

const addNewRecord = () => {
    const state = window.store.getState();
    if (state.generalReducer.currentUser) {
        axios.post(
            `${state.generalReducer.serverURL}/record/addOneRecord`,
            {
                beginDate: moment(new Date()).format('h:mm:ss DD/MM/YYYY') + "",
                duration: 0,
                roomId: state.conversationReducer.roomId,
                userId: state.generalReducer.currentUser._id,
            })
            .then(data => {
                console.log("The record saved successfuly: " + data);
            })
            .catch(error => {
                console.log("There is an error: " + error);
            });
    }
}

const updateRecordDetails = (additions) => {
    const state = window.store.getState();
    axios.put(
        `${state.generalReducer.serverURL}/record/updateRecordDetails/${state.conversationReducer.roomId}`,
        additions)
        .then(data => {
            console.log("The details update successfuly! " + data);
        })
        .catch(error => {
            console.log("There is an error: " + error);
        });
}



export {
    addNewConversation,
    updateConversationDetails,
    addNewRecord,
    updateRecordDetails,
    // getConversationsByUserId,
}