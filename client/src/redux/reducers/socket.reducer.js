import produce from 'immer';
import io from "socket.io-client";

import createReducer from './reducerUtils';

const initialState = {
    // socket: io.connect('https://meet-app-project.herokuapp.com/', {
    //     transports: ['polling'],
    // }),
    socket: io.connect('http://localhost:4000/', {
        transports: ['websocket']
    }),
    streamConstraints: { "video": true, "audio": true },
    localStream: "",
    remoteStream: "",
    localVideo: "",
    remoteVideo: "",
    peers: null,
    remoteVideoArr: {},
    remoteStreamArr: {},
}

const socketData = {
    // setSocket(state, action) {
    //     state.socket = action.payload;
    // },
    setStreamConstraints(state, action) {
        state.streamConstraints = action.payload;
    },
    setLocalStream(state, action) {
        state.localStream = action.payload;
    },
    setRemoteStream(state, action) {
        state.remoteStream = action.payload;
    },
    setLocalVideo(state, action) {
        state.localVideo = action.payload;
    },
    setRemoteVideo(state, action) {
        state.remoteVideo = action.payload;
    },
    setPeers(state, action) {
        state.peers = action.payload;
    },
    setRemoteVideoArr(state, action) {
        state.remoteVideoArr = action.payload;
    },
    setRemoteStreamArr(state, action) {
        state.remoteStreamArr = action.payload;
    },
}

export default produce((state, action) => createReducer(state, action, socketData), initialState);