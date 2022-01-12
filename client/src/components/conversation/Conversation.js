import React, { useRef, useState } from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { useEffect } from 'react';

import { actions } from '../../redux/actions';
import * as socketService from '../../services/socket.service';
import ContactsModal from '../contacts/ConcatsModal';

import './conversation.css'

const mapStateToProps = (state) => {
    return {
        socket: state.socketReducer.socket,
        remoteVideo: state.socketReducer.remoteVideo,
        remoteStream: state.socketReducer.remoteStream,
        email: state.conversationReducer.email,
        isCaller: state.conversationReducer.isCaller,
    };
}

const mapDispatchToProps = (dispatch) => ({
    setRoomId: (roomId) => dispatch(actions.setRoomId(roomId)),
    setLocalVideo: (localVideo) => dispatch(actions.setLocalVideo(localVideo)),
    setRemoteVideo: (remoteVideo) => dispatch(actions.setRemoteVideo(remoteVideo)),
    setIfJoinedUser: (ifJoinedUser) => dispatch(actions.setIfJoinedUser(ifJoinedUser)),
    dispatch: dispatch,
});

function Conversation(props) {

    const { socket, remoteVideo, remoteStream, email, history, isCaller } = props;
    const { dispatch, setRoomId, setLocalVideo, setRemoteVideo, setIfJoinedUser } = props;

    const localVideoRef = useRef();
    const remoteVideoRef = useRef();

    const [smallVideoRef, setSmallVideoRef] = useState(remoteVideoRef);
    const [bigVideoRef, setBigVideoRef] = useState(localVideoRef);
    const [partisipantEnter, setPartisipantEnter] = useState(false);

    useEffect(() => {
        //אתחול  הוידאו
        setLocalVideo(localVideoRef.current);
        setRemoteVideo(remoteVideoRef.current);
        //אם עדיין לא הצטרף מישהו לשיחה
        if (remoteStream !== "" && remoteVideo !== "") {
            remoteVideo.srcObject = remoteStream;
            setRemoteVideo(remoteVideo);
            <ContactsModal />
            setBigVideoRef(remoteVideoRef);
            setSmallVideoRef(localVideoRef);
        }
        else {
            setIfJoinedUser(true);
        }
        //פתיחת הסוקט
        socketService.openMediaSource();
        socketService.moreSettings();
        //כשמצטרף לשיחה
        if (window.location.href.includes('connection')) {
            let room = window.location.href.slice(window.location.href.lastIndexOf('/') + 1);
            setRoomId(room);
            socket.emit('join', { room });
            socket.emit('partisipantEnter', { room });
        }
        else {
            //כשיוצר שיחה חדשה
            let room = Math.random(10).toString(36).substring(7);
            setRoomId(room);
            socket.emit('create', { room });
        }
        //הגדרת הארועים מהשרת
        socket.on('created', event => dispatch({ type: 'CREATED_EVENT_FROM_SOCKET', payload: event }));
        socket.on('joined', event => { dispatch({ type: 'JOINED_EVENT_FROM_SOCKET', payload: event }) });
        socket.on('candidate', event => socketService.candidateEventFromSocket(event));
        socket.on('ready', event => { dispatch({ type: 'READY_EVENT_FROM_SOCKET', payload: event }) });
        socket.on('offer', event => dispatch({ type: 'OFFER_EVENT_FROM_SOCKET', payload: event }));
        socket.on('answer', event => socketService.answerEventFromSocket(event));
        socket.on('initReceive', socketId => dispatch({ type: 'INITRECEIVE_EVENT_FROM_SOCKET', payload: socketId }));
        socket.on('initSend', socketId => dispatch({ type: 'INITSEND_EVENT_FROM_SOCKET', payload: socketId }));
        socket.on('toggleAudio', socketService.toggleAudioEventFromSocket);
        socket.on('hungUp', hungUpFunction);
        socket.on('partisipantEnter', () => { setPartisipantEnter(true) });

    }, []);

    function hungUpFunction() {
        history.push('./endScreen');
    }

    //החלפת הוידאו הלוקלאי במרוחק
    const toggleVideoClass = () => {
        setBigVideoRef(remoteVideoRef);
        setSmallVideoRef(localVideoRef);
    }

    return (
        <div className="conversationBg row">
            <video id="localVideo" muted className="local card offset-md-3" onClick={toggleVideoClass} autoPlay ref={bigVideoRef}></video>

            <div className="users offset-2 offset-md-10">
                {!isCaller ?
                    <div className="userparent ml-2">
                        <video id="gum" className="gum user shadow videoCircle" onClick={toggleVideoClass} autoPlay playsInline ref={smallVideoRef}></video>
                        <span className="tag">{email}</span>
                    </div>
                    : isCaller && partisipantEnter ?
                        <div className="userparent ml-2">
                            <video id="gum" className="gum user shadow videoCircle" onClick={toggleVideoClass} autoPlay playsInline ref={smallVideoRef}></video>
                            <span className="tag">{email}</span>
                        </div>
                        : ""}
            </div>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Conversation));
