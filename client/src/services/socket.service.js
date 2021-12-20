import { actions } from '../redux/actions';
import * as crud from '../redux/middlewares/crud';
import { firebase } from './firebase.service';
import moment from 'moment'

let mediaSource = new MediaSource();
let rtcPeerConnection, recordedBlobs = [], mediaRecorder;
// let iceServers = {
//     iceServers: [
//         {
//             urls: "stun:stun.services.mozilla.com",
//         },
//         {
//             urls: "stun:stun.l.google.com:19302",
//         },
//     ],
// };
let iceServers = { urls: "stun:stun.1.google.com:19302" };


const openMediaSource = () => {
    mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
}

function handleSourceOpen() {
    console.log('MediaSource opened');
    let sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
    console.log('Source buffer: ', sourceBuffer);
}

const moreSettings = () => {
    let isSecureOrigin = window.location.protocol === 'https:' ||
        window.location.host.includes('localhost');
    if (!isSecureOrigin) {
        alert('getUserMedia() must be run from a secure origin: HTTPS or localhost.' +
            '\n\nChanging protocol to HTTPS');
        window.location.protocol = 'HTTPS';
    }
}

const addLocalStream = ({ dispatch, getState }) => next => action => {
    if (action.type === 'ADD_LOCAL_STREAM') {
        dispatch(actions.setLocalStream(action.payload));
        let localVideo = getState().socketReducer.localVideo;
        localVideo.srcObject = action.payload;
        dispatch(actions.setLocalVideo(localVideo));
    }
    return next(action);
}

const createdEventFromSocket = ({ dispatch, getState }) => next => action => {
    if (action.type === 'CREATED_EVENT_FROM_SOCKET') {
        navigator.mediaDevices
            .getUserMedia(getState().socketReducer.streamConstraints)
            .then(function (stream) {
                dispatch({ type: 'ADD_LOCAL_STREAM', payload: stream });
                dispatch(actions.setIsCaller(true));
                crud.addNewConversation();
            })
            .catch(function (err) {
                console.log(err);
                if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                    console.log("required track is missing");
                } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
                    console.log("webcam or mic are already in use");
                } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
                    console.log("constraints can not be satisfied by avb. devices");
                } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                    console.log("permission denied in browser");
                } else if (err.name === "TypeError" || err.name === "TypeError") {
                    console.log("empty constraints object");
                } else {
                    console.log("other errors");
                }
            });
    }
    return next(action);
}

//TODO save cuurent user that join to the conversation.
const joinedEventFromSocket = ({ dispatch, getState }) => next => action => {
    if (action.type === 'JOINED_EVENT_FROM_SOCKET') {
        navigator.mediaDevices
            .getUserMedia(getState().socketReducer.streamConstraints)
            .then(function (stream) {
                dispatch({ type: 'ADD_LOCAL_STREAM', payload: stream });
                getState().socketReducer.socket.emit('ready', getState().conversationReducer.roomId);
                crud.updateConversationDetails({
                    // participants: [getState().generalReducer.currentUser],
                    beginDate: moment(new Date()).format('h:mm:ss DD/MM/YYYY') + "",
                });
            })
            .catch(function (err) {
                console.log(err);
                if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
                    console.log("required track is missing");
                } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
                    console.log("webcam or mic are already in use");
                } else if (err.name === "OverconstrainedError" || err.name === "ConstraintNotSatisfiedError") {
                    console.log("constraints can not be satisfied by avb. devices");
                } else if (err.name === "NotAllowedError" || err.name === "PermissionDeniedError") {
                    console.log("permission denied in browser");
                } else if (err.name === "TypeError" || err.name === "TypeError") {
                    console.log("empty constraints object");
                } else {
                    console.log("other errors");
                }
            });
    }
    return next(action)
}

const candidateEventFromSocket = (event) => {
    let candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate
    });
    rtcPeerConnection.addIceCandidate(candidate);
}

const readyEventFromSocket = ({ dispatch, getState }) => next => action => {
    if (action.type === 'READY_EVENT_FROM_SOCKET') {
        if (getState().conversationReducer.isCaller) {
            dispatch({ type: 'CREATE_PEER_CONNECTION' });
            let offerOptions = {
                //NOTE  this line doesn't exist in the last version.
                offerToReceiveVideo: 1,
                offerToReceiveAudio: 1
            };
            rtcPeerConnection
                .createOffer(offerOptions)
                .then((desc) => setLocalAndOffer(desc))
                .catch((e) => console.log(e));
        }
    }
    return next(action);
}

const offerEventFromSocket = ({ dispatch, getState }) => next => action => {
    if (action.type === 'OFFER_EVENT_FROM_SOCKET') {
        if (!getState().conversationReducer.isCaller) {
            dispatch({ type: 'CREATE_PEER_CONNECTION' });
            rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(action.payload));
            rtcPeerConnection
                .createAnswer()
                .then((desc) => setLocalAndAnswer(desc))
                .catch((e) => console.log(e));
        }
    }
    return next(action);
}

const answerEventFromSocket = (event) => {
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event));
}

const toggleAudioEventFromSocket = (event) => {
    console.log(event)
    addAudioEvent(event);
}

// const toggleVideoEventFromSocket = (event) => {
//     addVideoEvent(event);
// }

function addAudioEvent(event) {
    // alert(event);
    console.log(event);
    // let p = document.createElement("p");
    // p.appendChild(document.createTextNode(event));
}

function addVideoEvent(event) {
    // alert(event);
    console.log(event);
    // let p = document.createElement("p");
    // p.appendChild(document.createTextNode(event));
}

const onIceCandidate = (event) => {
    if (event.candidate) {
        console.log("sending ice candidate");
        window.store.getState().socketReducer.socket.emit("candidate", {
            type: "candidate",
            label: event.candidate.sdpMLineIndex,
            id: event.candidate.sdpMid,
            candidate: event.candidate.candidate,
            room: window.store.getState().conversationReducer.roomId,
        });
    }
}

const onAddStream = ({ dispatch, getState }) => next => action => {
    if (action.type === 'ON_ADD_STREAM') {
        dispatch(actions.setRemoteStream(action.payload.stream));
        let remoteVideo = getState().socketReducer.remoteVideo;
        remoteVideo.srcObject = action.payload.stream;
        remoteVideo.play();
        dispatch(actions.setRemoteVideo(remoteVideo));
        if (getState().socketReducer.remoteStream.getAudioTracks().length > 0) {
            addAudioEvent("Remote user is sending Audio");
        } else {
            addAudioEvent("Remote user is not sending Audio");
        }
    }
    return next(action);
}

const setLocalAndOffer = (sessionDescription) => {
    rtcPeerConnection.setLocalDescription(sessionDescription);
    window.store.getState().socketReducer.socket.emit("offer", {
        type: "offer",
        sdp: sessionDescription,
        room: window.store.getState().conversationReducer.roomId,
    });
}

function setLocalAndAnswer(sessionDescription) {
    rtcPeerConnection.setLocalDescription(sessionDescription);
    window.store.getState().socketReducer.socket.emit("answer", {
        type: "answer",
        sdp: sessionDescription,
        room: window.store.getState().conversationReducer.roomId,
    });
}

const createPeerConnection = ({ dispatch, getState }) => next => action => {
    if (action.type === 'CREATE_PEER_CONNECTION') {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = onIceCandidate;
        rtcPeerConnection.onaddstream = event => dispatch({ type: 'ON_ADD_STREAM', payload: event });
        rtcPeerConnection.addStream(getState().socketReducer.localStream);
    }
    return next(action);
}

function toggleAudio() {
    window.store.getState().socketReducer.localStream.getAudioTracks()[0].enabled = !window.store.getState().socketReducer.localStream.getAudioTracks()[0].enabled;
    window.store.getState().socketReducer.socket.emit("toggleAudio", {
        type: "toggleAudio",
        room: window.store.getState().conversationReducer.roomId,
        message: window.store.getState().socketReducer.localStream.getAudioTracks()[0].enabled
            ? "Remote user's audio is unmuted"
            : "Remote user's audio is muted",
    });
}

const toggleVideoEventFromSocket = ({ dispatch, getState }) => next => action => {
    if (action.type === 'TOGGLE_VIDEO_EVENT_FROM_SOCKET') {
        dispatch(actions.setRemoteVideoStatus(action.payload.remoteVideoStatus));
        dispatch(actions.setRemoteUserProfile(action.payload.remoteUserProfile));
        console.log(action.payload);
    }
    return next(action);
}

function toggleVideo() {
    window.store.getState().socketReducer.localStream.getVideoTracks()[0].enabled = !window.store.getState().socketReducer.localStream.getVideoTracks()[0]
        .enabled;
    window.store.getState().socketReducer.socket.emit("toggleVideo", {
        remoteUserProfile: window.store.getState().generalReducer.currentUser.picture,
        remoteVideoStatus: !(window.store.getState().conversationReducer.localVideoStatus),
        type: "toggleVideo",
        room: window.store.getState().conversationReducer.roomId,
        message: window.store.getState().socketReducer.localStream.getVideoTracks()[0].enabled
            ? "Remote user's video is unmuted"
            : "Remote user's video is muted",
    });
}

//TODO Check this function!
//? We must do this function or we can menage without??
const checkForVideoAudioAccess = async () => {
    try {
        const cameraResult = await navigator.permissions.query({ name: 'camera' });
        let isCameraAccessGranted = cameraResult.state !== 'denied';
        const microphoneResult = await navigator.permissions.query({ name: 'microphone' });
        let isMicrophoneAccessGranted = microphoneResult.state !== 'denied';
        // window.store.getActions().socketReducer.setStreamConstraints(null);
        window.store.getState().socketReducer.setStreamConstraints({ "video": !isCameraAccessGranted, "audio": !isMicrophoneAccessGranted });
    } catch (e) {
        console.error('An error occurred while checking the site permissions', e);
    }

    return true;
}

function handleDataAvailable(event) {
    if (event.data && event.data.size > 0) {
        recordedBlobs.push(event.data);
    }
}

//העלאת ההקלטה לאחסון בשרת
const uploadRecordToStorage = (record) => {
    var storageRef = firebase.storage().ref();
    var metadata = {
        contentType: 'video/mp4'
    };
    let state = window.store.getState();
    record.name = state.generalReducer.currentUser._id + "_" + state.conversationReducer.roomId + "_" + Date.now().toString() + ".webm";
    var uploadTask = storageRef.child('Records/' + record.name).put(record, metadata);
    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED:
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING:
                    console.log('Upload is running');
                    break;
            }
        },
        (error) => {
            switch (error.code) {
                case 'storage/unauthorized':
                    console.log("User doesn't have permission to access the object");
                    break;
                case 'storage/canceled':
                    console.log("User canceled the upload");
                    break;
                case 'storage/unknown':
                    console.log("Unknown error occurred, inspect error.serverResponse");
                    break;
            }
        },
        () => {
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                crud.updateRecordDetails({
                    recordUrl: downloadURL,
                });
            });
        }
    );
}

function handleStop(event) {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
    let blob = new Blob(recordedBlobs, { type: 'video/webm' });
    uploadRecordToStorage(blob);

}

function toggleRecording(isRecord) {
    if (isRecord) {
        startRecording();
    } else {
        stopRecording();
    }
}

function startRecording() {
    let options = { mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000 };

    try {
        mediaRecorder = new MediaRecorder(window.store.getState().socketReducer.remoteStream, options);//window.stream, options);‏

        // mediaRecorder = new MediaRecorder(window.store.getState().socketReducer.localStream, options);//window.stream, options);
        crud.addNewRecord();
    } catch (e0) {
        console.log('Unable to create MediaRecorder with options Object: ', options, e0);
        try {
            options = { mimeType: 'video/webm;codecs=vp8', bitsPerSecond: 100000 };
            mediaRecorder = new MediaRecorder(window.store.getState().socketReducer.localStream, options);
        } catch (e1) {
            console.log('Unable to create MediaRecorder with options Object: ', options, e1);
            try {
                options = 'video/mp4';
                mediaRecorder = new MediaRecorder(window.store.getState().socketReducer.localStream, options);
            } catch (e2) {
                alert('MediaRecorder is not supported by this browser.');
                console.error('Exception while creating MediaRecorder:', e2);
                return;
            }
        }
    }
    console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
    mediaRecorder.onstop = handleStop;
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.start(10);
    console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
    mediaRecorder.stop();
    crud.updateRecordDetails({
        finishDate: moment(new Date()).format('h:mm:ss DD/MM/YYYY ') + "",
    });
    crud.updateConversationDetails({
        wasRecord: true,
    });
    // recordedVideo.controls = true;
}

function hungUpConversation() {
    let state = window.store.getState();

    crud.updateConversationDetails({
        wasConversation: true,
        // beginDate:moment(new Date()).format('h:mm:ss DD/MM/YYYY')+"",
        closeDate: moment(new Date()).format('h:mm:ss DD/MM/YYYY') + "",
    });
    //TODO Free the remote stream.
    let localStream = state.socketReducer.localStream;
    let localVideo = state.socketReducer.localVideo;
    if (localStream) {
        const tracks = localStream.getTracks();
        tracks.forEach(function (track) {
            track.stop()
        })
        localVideo.srcObject = null
    }
    let remoteStream = state.socketReducer.remoteStream;
    let remoteVideo = state.socketReducer.remoteVideo;
    if (remoteStream) {
        const tracks = remoteStream.getTracks();
        tracks.forEach(function (track) {
            track.stop()
        })
        remoteVideo.srcObject = null
    }
}

export {
    openMediaSource,
    moreSettings,
    addLocalStream,
    createdEventFromSocket,
    joinedEventFromSocket,
    candidateEventFromSocket,
    readyEventFromSocket,
    offerEventFromSocket,
    answerEventFromSocket,
    toggleAudioEventFromSocket,
    toggleVideoEventFromSocket,
    onAddStream,
    createPeerConnection,
    checkForVideoAudioAccess,
    toggleRecording,
    toggleAudio,
    toggleVideo,
    hungUpConversation,
};