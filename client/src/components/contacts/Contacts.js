import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import styled from 'styled-components';

import { actions } from '../../redux/actions';
import * as crud from '../../redux/middlewares/crud';

// import BgColorProfile from './BgColorProfile';
import './contacts.css';

function mapStateToProps(state) {
    return {
        contacts: state.contactsReducer.contacts,
        additionalContacts: state.contactsReducer.additionalContacts,
        email: state.conversationReducer.email,
        socket: state.socketReducer.socket,
        roomId: state.conversationReducer.roomId,
        currentUser: state.generalReducer.currentUser,
    };
}

const mapDispatchToProps = (dispatch) => ({
    setEmail: (email) => dispatch(actions.setEmail(email)),
    setShowContactsModal: (showContactsModal) => dispatch(actions.setShowContactsModal(showContactsModal)),
    addOneContact: (emailAddress) => dispatch({ type: 'ADD_ONE_CONTACT', payload: emailAddress }),
    getAdditionalContacts: (userId) => dispatch({ type: 'GET_ADDITIONAL_CONTACTS', payload: userId }),
    getContacts: (token) => dispatch({ type: 'GET_CONTACTS', payload: token }),
});

// const useStyles = makeStyles((theme) => ({
//     root: {
//         display: 'flex',
//         '& > *': {
//             margin: theme.spacing(1),
//         },
//     },
// }));

function Contacts(props) {

    const { contacts, additionalContacts, socket, roomId, currentUser, } = props;
    const { setEmail, setShowContactsModal, addOneContact, } = props;

    const [additionalProfilesColors, setAdditionalProfilesColors] = useState([]);

    useEffect(() => {
        setShowContactsModal(true);
    }, [contacts, additionalContacts]);

    const selectConversationPartnerAndDial = (emailAddress) => {
        //ולידציה על האימייל שהוכנס
        var re = /\S+@\S+\.\S+/;
        if (re.test(emailAddress)) {
            setEmail(emailAddress);
            console.log(emailAddress);

            socket.emit('selectParticipate', {
                emailAddress, roomId, currentUser
            });

            crud.updateConversationDetails({ participants: emailAddress });

            //חיפוש האם קיים איש הקשר הזה ברשימת אנשי הקשר
            const existAtContacts = contacts.find(contact => contact.emailAddresses[0].value === emailAddress)
            //חיפוש האם קיים איש הקשר הזה ברשימת אנשי הקשר הנוספים
            const existAtAdditionalContacts = additionalContacts.find(c => c.email === emailAddress);
            //במקרה שכתובת המייל אינה רשומה בחשבון
            //בתור איש קשר נוסף DBנשמור אותה ב
            if (!existAtContacts && !existAtAdditionalContacts) {
                addOneContact(emailAddress);
            }
        }
        //הצגת המודל של האנשי קשר
        setShowContactsModal(false);
    }

    return (
        <div className="contactsModal">
            <input id="addContactInput" placeholder="Please write an email address" onKeyPress={e => {
                if (e.key === "Enter") selectConversationPartnerAndDial(e.target.value)
            }} ></input>
            <hr></hr>
            <table className="contactsTable table table-borderless text-right" >
                <div className="contactsScrollDiv">
                    <tbody>
                        <tr style={{ height: 30 }}>
                        </tr>
                        {contacts.map(contact => (
                            <tr id="trContacts" key={contact.emailAddresses[0].value} name={contact.emailAddresses[0].value} onClick={e => selectConversationPartnerAndDial(contact.emailAddresses[0].value)} style={{ height: 60 }}>
                                <td name={contact.emailAddresses[0].value}>
                                    <img className="profileImg" src={contact.photos[0].url} alt='...' style={{ width: "30%", cursor: "pointer" }} />
                                </td>
                                <td name={contact.emailAddresses[0].value} style={{ cursor: "pointer" }}>
                                    <div name={contact.emailAddresses[0].value} >{contact.names[0].displayName}</div>
                                    <div name={contact.emailAddresses[0].value} >{contact.emailAddresses[0].value}</div>
                                </td>
                            </tr>
                        ))}
                        {additionalContacts.map((contact, index) => (
                            <tr id="trContacts" key={index} name={contact.email} onClick={e => selectConversationPartnerAndDial(contact.email)} style={{ height: 60 }}>
                                <td name={contact.email}>
                                    <div >
                                        {/* <Avatar style={{ color: "wight",backgroundColor:{getRandomColor}}}> */}
                                        <Avatar style={{ color: "wight" }}>
                                            {/* <BgColorProfile>
                                                {contact.email.slice(0, 1)}
                                            </BgColorProfile> */}
                                        </Avatar>
                                    </div>
                                    {/* <img className="profileImg" src={contact.photos[0].url} alt='...' style={{ width: "20%", cursor: "pointer" }} /> */}
                                </td>
                                <td name={contact.email} style={{ cursor: "pointer" }}>
                                    <div name={contact.email} >{contact.email}</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </div>

            </table>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Contacts));
