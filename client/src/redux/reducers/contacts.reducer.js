import produce from 'immer';

import createReducer from './reducerUtils';

const initialState = {
    contacts: [],
    additionalContacts: [],
    showContactsModal: false,
}

const contactsData = {
    setContacts(state, action) {
        state.contacts = action.payload;
    },
    setAdditionalContacts(state, action) {
        state.additionalContacts = action.payload;
    },
    setShowContactsModal(state, action) {
        state.showContactsModal = action.payload;
    },
}

export default produce((state, action) => createReducer(state, action, contactsData), initialState);