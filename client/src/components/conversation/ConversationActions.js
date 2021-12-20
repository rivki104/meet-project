import React, { useRef, useState, useEffect } from 'react'
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { FaMicrophone, FaMicrophoneSlash, FaVideoSlash, FaVideo } from "react-icons/fa";
import { ImPhoneHangUp } from "react-icons/im";
import { MdChat } from "react-icons/md";

import ConcatsModal from '../contacts/ConcatsModal';
import { actions } from '../../redux/actions';
import * as socketService from '../../services/socket.service';

import './conversation.css'
import recordSign from '../../assets/recordSign.png';

const mapStateToProps = (state) => {
    return {
        socket: state.socketReducer.socket,
        showContactsModal: state.contactsReducer.showContactsModal,
        currentUser: state.generalReducer.currentUser,
        contacts: state.contactsReducer.contacts,
        additionalContacts: state.contactsReducer.additionalContacts,
        loadingLastConversations: state.generalReducer.loadingLastConversations,
        isCaller: state.conversationReducer.isCaller,
        ifJoinedUser: state.conversationReducer.ifJoinedUser,
        remoteStream: state.socketReducer.remoteStream,
        roomId: state.conversationReducer.roomId,
    };
}

const mapDispatchToProps = (dispatch) => ({
    setShowContactsModal: (showContactsModal) => dispatch(actions.setShowContactsModal(showContactsModal)),
    getAdditionalContacts: (userId) => dispatch({ type: 'GET_ADDITIONAL_CONTACTS', payload: userId }),
    getContacts: (token) => dispatch({ type: 'GET_CONTACTS', payload: token }),
    setLoadingLastConversations: (loadingLastConversations) => dispatch(actions.setLoadingLastConversations(loadingLastConversations)),
});

function ConversationActions(props) {

    const { roomId, socket, history, currentUser, contacts, isCaller, ifJoinedUser, remoteStream } = props;
    const { setShowContactsModal, getAdditionalContacts, getContacts, setLoadingLastConversations } = props;

    const [audio, setAudio] = useState(false);
    const [inRecording, setInRecording] = useState(false);

    const [videoStatus, setVideoStatus] = useState(false);

    const recordSignCircle = useRef();

    useEffect(() => {
        if (currentUser !== null && contacts.length === 0) {
            getContacts(currentUser.token);
            getAdditionalContacts(currentUser._id);
        }
    }, []);

    //הקלטה

    const record = () => {
        //אם באמצע הקלטה
        if (!inRecording) {
            setInRecording(true);
            socketService.toggleRecording(true);
            recordSignCircle.current.style.display = "inline-flex";
            document.getElementsByClassName("recordBtn")[0].style.display = "none";
        }
        else {
            setInRecording(false)
            socketService.toggleRecording(false);
            recordSignCircle.current.style.display = "none";
            document.getElementsByClassName("recordBtn")[0].style.display = "block";
        }
    }
    //הצגת המודל של האנשי קשר
    const handleShowContacts = () => {
        //שליפת אנשי קשר של המשתמש המחובר
        // if (currentUser !== null && contacts.length === 0) {
        //     getContacts(currentUser.token);
        //     getAdditionalContacts(currentUser._id);
        setShowContactsModal(true);
        // }
    };

    //ניתוק השיחה והעברה לדף הסיום
    const hungUp = () => {
        socket.emit('hungUp', { roomId });
        socketService.hungUpConversation();
        history.push('./endScreen');
    }

    //השתקה/הפעלה של האודיו
    const toggleAudio = () => {
        setAudio(!audio);
        socketService.toggleAudio();
    }

    const toggleVideo = () => {
        socketService.toggleVideo();
        setVideoStatus(!videoStatus)
    }

    const goHistory = () => {
        setLoadingLastConversations(true);
        history.push("/lastConversations");
    }

    return (
        <>
            {/* כפתורים עם האייקונים של הפעולות בשיחה */}
            <div className="row actionsBottomDiv pt-3">
                {/* <MdChat size={45} onClick={() => props.setVisibleLeft(true)} className="actionIcon ml-5 mt-3 mr-3" /> */}
                {isCaller ?
                    <div className="ml-5 addPeoplePlus shadow" onClick={handleShowContacts}>
                        <svg className="m-auto" xmlns="http://www.w3.org/2000/svg" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" width="40" height="40" >
                            <g>
                                <g>
                                    <g>
                                        <path d="M156,256c0,11.046,8.954,20,20,20h60v60c0,11.046,8.954,20,20,20s20-8.954,20-20v-60h60c11.046,0,20-8.954,20-20     c0-11.046-8.954-20-20-20h-60v-60c0-11.046-8.954-20-20-20s-20,8.954-20,20v60h-60C164.954,236,156,244.954,156,256z" />
                                        <path d="M160.406,61.8l25.869-10.716c10.204-4.228,15.051-15.927,10.823-26.132c-4.228-10.205-15.926-15.054-26.132-10.823     l-25.869,10.716c-10.204,4.228-15.051,15.927-10.823,26.132C138.488,61.148,150.168,66.038,160.406,61.8z" />
                                        <path d="M256,0c-11.046,0-20,8.954-20,20s8.954,20,20,20c119.378,0,216,96.608,216,216c0,119.378-96.608,216-216,216     c-119.378,0-216-96.608-216-216c0-11.046-8.954-20-20-20s-20,8.954-20,20c0,141.483,114.497,256,256,256     c141.483,0,256-114.497,256-256C512,114.517,397.503,0,256,0z" />
                                        <path d="M93.366,113.165l19.799-19.799c7.811-7.811,7.811-20.475,0-28.285c-7.811-7.81-20.475-7.811-28.285,0L65.081,84.88     c-7.811,7.811-7.811,20.475,0,28.285C72.89,120.974,85.555,120.976,93.366,113.165z" />
                                        <path d="M24.952,197.099c10.227,4.236,21.914-0.642,26.132-10.823l10.716-25.87c4.228-10.205-0.619-21.904-10.823-26.132     c-10.207-4.227-21.904,0.619-26.132,10.823l-10.716,25.869C9.901,181.172,14.748,192.871,24.952,197.099z" />
                                    </g>
                                </g>
                            </g>
                        </svg>
                    </div>
                    : ""
                }
                {!isCaller ?
                    <div className="offset-1"> </div>
                    :
                    ""
                }
                <div className="col-1 offset-2 offset-md-4 d-flex justify-content-around p-3">
                    <div onClick={toggleAudio}>
                        {!audio ?
                            <div className="round shadow"><div><FaMicrophone size={41} title="Mute" className="actionIcon m-1" /></div></div>
                            :
                            <div className="round shadow"><div><FaMicrophoneSlash size={44} title="Un Mute" className="actionIcon m-1" /></div></div>
                        }
                    </div>
                    {isCaller ?
                        <div className="round shadow z-3"><div><ImPhoneHangUp onClick={hungUp} title="Hung Up" size={40} className="actionIcon m-1" /></div></div>
                        : ""}
                    {
                        videoStatus ?
                            <div className="round shadow"><div><FaVideoSlash title="Video" onClick={toggleVideo} size={40} className="actionIcon mt-1" /></div></div>
                            :
                            <div className="round shadow"><div><FaVideo title="Video" onClick={toggleVideo} size={38} className="actionIcon m-2" /></div></div>

                    }

                </div>
                <div className="offset-1 offset-md-1">
                    {isCaller && remoteStream ?
                        <svg className="rec recordBtn" xmlns="http://www.w3.org/2000/svg" id="Capa_1" onClick={e => record(e)} enable-background="new 0 0 512 512" height="50" viewBox="0 0 512 512" width="50"><path d="m485 382.609h-458c-14.888 0-27-12.112-27-27v-199.218c0-14.888 12.112-27 27-27h458c14.888 0 27 12.112 27 27v199.219c0 14.887-12.112 26.999-27 26.999z" fill="#dbe2eb" /><path d="m0 256v99.609c0 14.888 12.112 27 27 27h458c14.888 0 27-12.112 27-27v-99.609z" fill="#ced3df" /><path d="m384.52 309.185c-31.906 0-57.864-25.958-57.864-57.864s25.958-57.863 57.864-57.863 57.864 25.957 57.864 57.863-25.958 57.864-57.864 57.864z" fill="#fa676d" /><path d="m326.861 256c2.393 29.724 27.329 53.185 57.659 53.185 30.329 0 55.266-23.461 57.659-53.185z" fill="#f92f3e" /><path d="m243.663 221.297c-7.046 0-11.125 3.955-11.125 12.361v32.756c0 8.406 4.079 12.361 11.248 12.361 9.89 0 10.508-7.539 10.878-12.361.371-4.572 4.574-5.809 9.518-5.809 6.675 0 9.765 1.73 9.765 9.147 0 16.441-13.35 25.834-31.026 25.834-16.192 0-29.666-7.91-29.666-29.172v-32.756c0-21.262 13.474-29.174 29.666-29.174 17.677 0 31.026 8.9 31.026 24.6 0 7.416-3.09 9.146-9.642 9.146-5.191 0-9.395-1.359-9.642-5.809-.122-3.214-.493-11.124-11-11.124z" fill="#fa676d" /><path d="m264.183 260.605c-4.944 0-9.147 1.236-9.518 5.809-.37 4.822-.988 12.361-10.878 12.361-7.169 0-11.248-3.955-11.248-12.361v-10.414h-19.283v10.414c0 21.262 13.474 29.172 29.666 29.172 17.677 0 31.026-9.393 31.026-25.834-.001-7.416-3.091-9.147-9.765-9.147z" fill="#f92f3e" /><path d="m167.765 242.188h18.542c3.708 0 5.81 3.584 5.81 7.539 0 3.338-1.73 7.293-5.81 7.293h-18.542v21.014h33.128c3.709 0 5.811 3.957 5.811 8.529 0 3.957-1.731 8.283-5.811 8.283h-44.005c-4.203 0-8.406-1.979-8.406-5.934v-78.494c0-3.955 4.203-5.934 8.406-5.934h44.005c4.079 0 5.811 4.328 5.811 8.283 0 4.574-2.102 8.529-5.811 8.529h-33.128z" fill="#fa676d" /><path d="m200.893 278.033h-33.128v-21.013h18.542c1.275 0 2.321-.386 3.155-1.02h-40.981v32.912c0 3.955 4.203 5.934 8.406 5.934h44.005c4.079 0 5.811-4.326 5.811-8.283 0-4.573-2.101-8.53-5.81-8.53z" fill="#f92f3e" /><path d="m76.291 210.295c0-3.09 2.349-5.811 5.934-5.811h25.588c16.935 0 30.408 6.305 30.408 26.453 0 13.846-6.305 21.756-14.957 25.094l15.08 27.318c.495.742.618 1.607.618 2.225 0 4.82-6.428 10.012-12.113 10.012-2.473 0-4.821-.988-6.181-3.584l-16.935-32.881h-8.159v29.791c0 3.955-4.82 5.934-9.642 5.934-4.82 0-9.642-1.979-9.642-5.934v-78.617zm19.283 11.002v22.992h12.238c6.922 0 11.125-2.844 11.125-11.496 0-8.654-4.203-11.496-11.125-11.496z" fill="#fa676d" /><path d="m123.264 256.031c.025-.01.048-.022.073-.031h-47.046v32.912c0 3.955 4.821 5.934 9.642 5.934s9.642-1.979 9.642-5.934v-29.791h8.159l16.935 32.881c1.359 2.596 3.708 3.584 6.181 3.584 5.686 0 12.113-5.191 12.113-10.012 0-.617-.123-1.482-.618-2.225z" fill="#f92f3e" /></svg>
                        : ""
                    }
                    <div className="recordingNow recordSignCircleRecord shadow rec" onClick={e => record(e)} src={recordSign} ref={recordSignCircle} style={{ display: "none" }}></div>
                </div>

                {isCaller && !remoteStream ?
                    <div className="offset-8 offset-md-10 col-md-1">
                        {ifJoinedUser === true ?
                            <div className="archive">
                                <div className="_3dots">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                                <Link onClick={goHistory} className="archive_message">History Conversations</Link>
                            </div>
                            : ""}</div>
                    : ""}
                <ConcatsModal />
            </div>
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ConversationActions));