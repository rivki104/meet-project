import produce from 'immer';

import createReducer from './reducerUtils';

const initialState = {
    // serverURL: 'https://meet-app-project.herokuapp.com/api',
    serverURL: 'http://localhost:4000/api',
    currentUser: null,
    userConversations: [],
    ifJoin: false,
    loadingLastConversations: true,
    numApearLastConversation: 0,
}

const generalData = {
    setCurrentUser(state, action) {
        state.currentUser = action.payload;
    },
    setUserConversations(state, action) {
        state.userConversations = action.payload;
    },
    setIfJoin(state, action) {
        state.ifJoin = action.payload;
    },
    setLoadingLastConversations(state, action) {
        state.loadingLastConversations = action.payload;
    },
    setNumApearLastConversation(state, action) {
        state.numApearLastConversation = action.payload;
    },
}

export default produce((state, action) => createReducer(state, action, generalData), initialState);