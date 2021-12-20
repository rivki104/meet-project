
import produce from 'immer';

import createReducer from './reducerUtils';

const initialState = {
    roomId: '',
    email: '',
    isCaller: false,
    showPeoplesComponent: false,
    numOfParticipants: 0,
    ifJoinedUser: false,
    videoStatus: false,
    audioStatus: false,
}

const convarsetionData = {
    setRoomId(state, action) {
        state.roomId = action.payload;
    },
    setEmail(state, action) {
        state.email = action.payload;
    },
    setIsCaller(state, action) {
        state.isCaller = action.payload;
    },
    setShowPeoplesComponent(state, action) {
        state.showPeoplesComponent = action.payload;
    },
    setNumOfParticipants(state, action) {
        state.numOfParticipants = action.payload;
    },
    setHasRecord(state, action) {
        state.hasRecord = action.payload;
    },
    setIfJoinedUser(state, action) {
        state.ifJoinedUser = action.payload;
    },
    setVideoStatus(state, action) {
        state.videoStatus = action.payload;
    },
    setAudioStatus(state, action) {
        state.audioStatus = action.payload;
    },
}

export default produce((state, action) => createReducer(state, action, convarsetionData,), initialState);