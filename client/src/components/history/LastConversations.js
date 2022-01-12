import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Spinner } from 'react-bootstrap'

import RecordDetails from './RecordDetails';
import Header from '../general-components/Header';
import { firebase } from '../../services/firebase.service';

import './lastConversation.css';
import { actions } from '../../redux/actions';

import { useSpeechSynthesis } from "react-speech-kit";

const mapStateToProps = (state) => {
    return {
        currentUser: state.generalReducer.currentUser,
        currentRecord: state.recordReducer.currentRecord,
        userConversations: state.generalReducer.userConversations,
        loadingLastConversations: state.generalReducer.loadingLastConversations,
        numApearLastConversation: state.generalReducer.numApearLastConversation,
    };
}

const mapDispatchToProps = (dispatch) => ({
    getConversationsByUserId: (id) => dispatch({ type: 'GET_CONVERSATIONS_BY_USER_ID', payload: id }),
    getRecordByUserAndConversation: (conversationId) => dispatch({ type: 'GET_RECORD_BY_USER_AND_CONVERSATION', payload: conversationId }),
    setLoadingLastConversations: (loadingLastConversations) => dispatch(actions.setLoadingLastConversations(loadingLastConversations)),
    setNumApearLastConversation: (numApearLastConversation) => dispatch(actions.setNumApearLastConversation(numApearLastConversation)),
    deleteConversationById: (conversationId) => dispatch({ type: 'DELETE_CONVERSATION_BY_ID', payload: conversationId }),
});



function LastConversations(props) {

    const { currentUser, userConversations, currentRecord, loadingLastConversations, numApearLastConversation } = props;
    const { getConversationsByUserId, getRecordByUserAndConversation, setLoadingLastConversations, setNumApearLastConversation, deleteConversationById } = props;
    const [recordUrl, setRecordUrl] = useState();
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [filteredUserConversations, setFilteredUserConversations] = useState(userConversations);

    const [spaekValue, setSpaekValue] = useState("");

    const { speak } = useSpeechSynthesis();

    useEffect(() => {
        speak({ text: "" });
        if (numApearLastConversation !== 0)
            setLoadingLastConversations(false);
        setNumApearLastConversation(numApearLastConversation + 1);
        //שליפת השיחות אם קיים משתמש
        if (currentUser)
            getConversationsByUserId(currentUser._id);

        // setFilteredUserConversations([...userConversations.filter(
        //     conversation => conversation.wasConversation === true)])

        // if (filteredUserConversations.length === 0) {
        //     alert("you have not conversations right now!")
        // }
    }, []);

    useEffect(() => {
        speak({ text: spaekValue });
        speak({ text: "" });
    }, [spaekValue])

    useEffect(() => {
        setFilteredUserConversations([...userConversations.filter(
            conversation => conversation.wasConversation === true)])
    }, [loadingLastConversations])

    useEffect(() => {
        //במקרה שקיימת הקלטה והיא נשלפה כראוי
        if (currentRecord !== '' && currentRecord !== undefined && currentRecord.recordUrl !== null && currentRecord.recordUrl !== undefined) {
            console.log("currentRecrod getRecord");
            //קבלת הכתובת מהמסד נתונים לצורך שליפה מהאחסון וכן פתיחת המודל של הנתונים
            let url = currentRecord.recordUrl.slice(currentRecord.recordUrl.indexOf('%') + 3);
            url = url.split('?')
            // setShowRecordModal(true);
            getRecordFromStorage(url[0]);
        }
    }, [currentRecord]);

    const conversationTableRef = useRef();

    //שליפת ההקלטות מהאחסון
    const getRecordFromStorage = (url) => {
        var storage = firebase.storage();
        //שליפת ההקלטה הספציפית לפי הכתובת שנשלפה מהמסד נתונים
        var pathReference = storage.ref(`Records/${url}`);
        pathReference.getDownloadURL()
            .then((url) => {
                console.log("from storage 111 " + url);
                setRecordUrl(url);
            })
            .catch((error) => {
                switch (error.code) {
                    case 'storage/object-not-found':
                        console.log("File doesn't exist");
                        break;
                    case 'storage/unauthorized':
                        console.log("User doesn't have permission to access the object");
                        break;
                    case 'storage/canceled':
                        console.log("User canceled the upload");
                        break;
                    case 'storage/unknown':
                        console.log("Unknown error occurred, inspect the server response");
                        break;
                }
            });
    }

    //שליפת ההקלטה הנבחרת
    const getRecordDetails = (conversationId) => {
        getRecordByUserAndConversation(conversationId);
        if (currentRecord !== '' && currentRecord !== undefined && currentRecord.recordUrl !== null && currentRecord.recordUrl !== undefined)
            setShowRecordModal(true);
    }

    const deleteConversation = (conversationId) => {
        // setFilteredUserConversations([...userConversations.filter(
        //     conversation => conversation.wasConversation === true)])
        setFilteredUserConversations([...userConversations.filter(
            conversation => conversation._id !== conversationId && conversation.wasConversation === true)]);

        deleteConversationById(conversationId);
    }

    // if(filteredUserConversations.length == 0){
    //     alert("You have not conversations right now!");
    // }

    return (
        <div>
            <div className="row lastConversationHeader">
                <Header />
                <h2 className="">Your conversations</h2>
                <div className="offset-8 offset-md-10 archive last" onMouseOver={() => setSpaekValue("go back to conversation")}>
                    <div className="_3dots black">
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <Link className="archive_message2 shadow" to="/conversation">Back to conversation</Link>
                </div>
            </div>
            <div>
                <div className="row">
                    {filteredUserConversations.length == 0 && !loadingLastConversations ?
                        <div className="haveNotConversations">You have not conversations right now!</div>
                        : ""
                    }
                    {loadingLastConversations ?
                        <div className="spinnerDiv">
                            <Spinner animation="border" variant="secondary" />
                        </div>
                        :
                        ""
                    }
                    <table className="table table-hover lastConversationTable" ref={conversationTableRef}>
                        <thead className="thead-light tableHead bg-light" >
                            <th>Participant</th>
                            <th>Conversation Date</th>
                            <th>Conversation Duration</th>
                            <th>Record</th>
                            <th>Delete conversation</th>
                        </thead>
                        {filteredUserConversations.length !== 0 ?
                            <tbody className="mt-5">
                                {/* {userConversations.filter(
                                        conversation => conversation.wasConversation === true).map( */}
                                {filteredUserConversations ? filteredUserConversations.map(
                                    conversation =>
                                        <tr>
                                            <td>
                                                {conversation.participants}
                                            </td>
                                            <td>
                                                {conversation.beginDate.split(" ")[0]}
                                                <br></br>
                                                {conversation.beginDate.split(" ")[1]}
                                            </td>
                                            <td>
                                                {conversation.duration}
                                            </td>

                                            <td>
                                                {conversation.wasRecord ?
                                                    <button className="btnRecordDetails btn btn-secondary" onClick={() => getRecordDetails(conversation._id)} onMouseOver={() => setSpaekValue("record details")}>Record Details</button>
                                                    :
                                                    <div style={{ color: "rgb(87, 84, 84)" }}>No recording</div>
                                                }
                                                {/* <button disabled={true} className="btn btn-secondary" onClick={() => getRecordDetails(conversation._id)}>Record Details</button>} */}
                                            </td>
                                            <td>
                                                <button className="btnDeleteConversation btn" onClick={() => deleteConversation(conversation._id)} onMouseOver={() => setSpaekValue("delete conversation")}>Delete Converstaion</button>
                                            </td>
                                        </tr>
                                ) : ""}
                            </tbody>
                            : ""}
                    </table>
                </div>
                <RecordDetails showRecordModal={showRecordModal} setShowRecordModal={setShowRecordModal} recordUrl={recordUrl} currentRecord={currentRecord} />
            </div >
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(LastConversations);
