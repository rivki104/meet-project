import axios from 'axios';
import moment from 'moment'

import { actions } from '../actions';

//שליפת המשתמש
const getOneUser = store => next => action => {
    if (action.type === 'GET_ONE_USER') {
        axios.get(`${store.getState().generalReducer.serverURL}/user/getOneUser/${action.payload}`)
            .then((data) => {
                store.dispatch(actions.setCurrentUser(data.data));
                console.log("Get user successfuly!");
            })
            .catch((error) => {
                console.log("Can't get this user with error: " + error.message);
            });
    }
    return next(action);
}

//הוספת משתמש
const addOneUser = store => next => action => {
    if (action.type === 'ADD_ONE_USER') {
        axios.post(`${store.getState().generalReducer.serverURL}/user/addOneUser`, action.payload)
            .then((data) => {
                store.dispatch(actions.setCurrentUser({ ...data.data }));
                console.log("Save user successfuly!");
            })
            .catch((error) => {
                console.log("Can't save this user with error: " + error.message)
            });
    }
    return next(action);
}

//שליפת שיחה לפי מזהה משתמש
const getConversationsByUserId = store => next => action => {
    if (action.type === 'GET_CONVERSATIONS_BY_USER_ID') {
        const state = window.store.getState();
        axios.get(`${state.generalReducer.serverURL}/conversation/getConversationsByUserId/${action.payload}`)
            .then(data => {
                store.dispatch(actions.setUserConversations(data.data));
                store.dispatch(actions.setLoadingLastConversations(false));
                return data.data;
            })
            .catch(error => {
                console.log("There is an error: " + error);
                return null;
            })
    }
    return next(action);
}

const getConversationsByRoomId = () => {
    const state = window.store.getState();
    axios.get(`${state.generalReducer.serverURL}/conversation/getConversationsByRoomId/${state.conversationReducer.roomId}`)
        .then(data => {
            // store.dispatch(actions.setUserConversations(data.data));
            // store.dispatch(actions.setLoadingLastConversations(false));
            return data.data;
        })
        .catch(error => {
            console.log("There is an error: " + error);
            return null;
        })
}

//שליפת הקלטה לפי מזהה משתמש ושיחה
const getRecordByUserAndConversation = store => next => action => {
    if (action.type === 'GET_RECORD_BY_USER_AND_CONVERSATION') {
        const state = store.getState();
        axios.get(
            `${state.generalReducer.serverURL}/record/getRecordByUserAndConversation/${state.generalReducer.currentUser._id}&${action.payload}`)
            .then(data => {
                console.log("The records got successfuly! " + data);
                store.dispatch(actions.setCurrentRecord(data.data[0]));
                return data.data;
            })
            .catch(error => {
                console.log("There is an error: " + error);
            });
    }
    return next(action);
}

//הוספת איש קשר חדש
const addOneContact = store => next => action => {
    if (action.type === 'ADD_ONE_CONTACT') {
        let contact = { email: action.payload, ownerUserId: store.getState().generalReducer.currentUser._id }
        console.log(contact);
        axios.post(`${store.getState().generalReducer.serverURL}/contact/addOneContact`, contact)
            .then((data) => {
                store.dispatch(actions.setContact([data.data]));
                console.log("Save contact successfuly!");
            })
            .catch((error) => {
                console.log("Can't save this contact with error: " + error.message)
            });
    }
    return next(action);
}

//שליפת אנשי קשר מהחשבון
const getContacts = store => next => action => {
    if (action.type === 'GET_CONTACTS') {
        if (store.getState().generalReducer.currentUser !== null && store.getState().generalReducer.currentUser.googleProfile !== null && store.getState().contactsReducer.contacts.length === 0) {
            axios.get(`${store.getState().generalReducer.serverURL}/contact/passUserToken/${action.payload}`)
                .then((data) => {
                    store.dispatch(actions.setContacts(store.getState().contactsReducer.contacts.concat(data.data)))
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }
    return next(action);
}

//הוספת שיחה חדשה
const addNewConversation = () => {
    const state = window.store.getState();
    if (state.conversationReducer.isCaller) {
        axios.post(
            `${state.generalReducer.serverURL}/conversation/addOneConversation`,
            {
                roomId: state.conversationReducer.roomId,
                createdUserId: state.generalReducer.currentUser._id,
                // participants: [state.generalReducer.currentUser],
                participants: null,
                // participants: null, ‏
                numOfParticipants: 1,
                beginDate: moment(new Date()).format('h:mm:ss DD/MM/YYYY') + "",
                // beginDate: dateFormat(new Date(Date.now), 'm-d-Y h:i:s')+"",
                // beginDate: new Date(Date.now()) + "",
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

//עדכון פרטי השיחה
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

//הוספת הקלטה
const addNewRecord = () => {
    const state = window.store.getState();
    if (state.generalReducer.currentUser) {
        axios.post(
            `${state.generalReducer.serverURL}/record/addOneRecord`,
            {
                beginDate: moment(new Date()).format('h:mm:ss DD/MM/YYYY') + "",
                finishDate: "0",
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

//עדכון פרטי ההקלטה
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

//מחיקת שיחה
// const deleteConversationById = (conversationId) => {
//     const state = window.store.getState();
//     axios.delete(
//         `${state.generalReducer.serverURL}/conversation/deleteConversationById/${conversationId}`)
//         .then(data => {
//             store.dispatch(actions.setUserConversations(data.data));
//             console.log("The conversation deleted succefully! " + data);
//         })
//         .catch(error => {
//             console.log("There is an error: " + error);
//         });
// }
const deleteConversationById = store => next => action => {
    if (action.type === "DELETE_CONVERSATION_BY_ID") {
        axios.delete(
            `${store.getState().generalReducer.serverURL}/conversation/deleteConversationById/${action.payload}`)
            .then(data => {
                store.dispatch(actions.setUserConversations(data.data));
                console.log("The conversation deleted succefully! " + data);
            })
            .catch(error => {
                console.log("There is an error: " + error);
            });
    }
    return next(action);
}


//שליפת האנשי קשר הנוספים
const getAdditionalContacts = store => next => action => {
    if (action.type === 'GET_ADDITIONAL_CONTACTS') {
        axios.get(`${store.getState().generalReducer.serverURL}/contact/getAdditionalContacts/${action.payload}`)
            .then(data => {
                store.dispatch(actions.setAdditionalContacts([...data.data.additionalContacts]));
            })
            .catch(error => {
                console.log("There is an error: " + error);
            })
    }
    return next(action);
}

export {
    getOneUser,
    addOneUser,
    getConversationsByUserId,
    getConversationsByRoomId,
    getRecordByUserAndConversation,
    addOneContact,
    getContacts,
    addNewConversation,
    updateConversationDetails,
    addNewRecord,
    updateRecordDetails,
    deleteConversationById,
    getAdditionalContacts,
}