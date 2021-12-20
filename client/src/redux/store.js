import { createStore, combineReducers, applyMiddleware } from 'redux';

import materialsReducer from './reducers/materials.reducer';
import generalReducer from './reducers/general.reducer';
import socketReducer from './reducers/socket.reducer';
import contactsReducer from './reducers/contacts.reducer';
import conversationReducer from './reducers/convarsetion.reducer'
import recordReducer from './reducers/record.reducer';
import {
    addLocalStream,
    createdEventFromSocket,
    joinedEventFromSocket,
    readyEventFromSocket,
    offerEventFromSocket,
    onAddStream,
    createPeerConnection,
} from '../services/socket.service';
import {
    getOneUser,
    addOneUser,
    getConversationsByUserId,
    getRecordByUserAndConversation,
    addOneContact,
    getContacts,
    getAdditionalContacts,
} from './middlewares/crud';

const reducer = combineReducers({
    materialsReducer,
    generalReducer,
    socketReducer,
    contactsReducer,
    conversationReducer,
    recordReducer,
});

const store = createStore(
    reducer,
    applyMiddleware(
        addLocalStream,
        createdEventFromSocket,
        joinedEventFromSocket,
        readyEventFromSocket,
        offerEventFromSocket,
        onAddStream,
        createPeerConnection,
        getOneUser,
        addOneUser,
        getContacts,
        getConversationsByUserId,
        getRecordByUserAndConversation,
        addOneContact,
        getAdditionalContacts,
    ));

window.store = store;
export default store;
