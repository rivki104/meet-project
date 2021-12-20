import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import ContactsToCall from '../contacts/ConcatsModal'
import { actions } from '../../redux/actions';

import './conversation.css'

const mapStateToProps = (state) => {
    return {
        showContactsModal: state.contactsReducer.showContactsModal,
        showPeoplesComponent: state.conversationReducer.showPeoplesComponent,
    };
}

const mapDispatchToProps = (dispatch) => ({
    setShowContactsModal: (showContactsModal) => dispatch(actions.setShowContactsModal(showContactsModal)),
});

function Peoples(props) {

    const { setShowContactsModal } = props;

    const handleShowContacts = () => {
        setShowContactsModal(true);
    };

    return (
        <>
            <div className="mt-3 peoplesComponent">
                <button className="pi pi-user-plus" onClick={handleShowContacts} style={{ width: "50px", height: "40px" }}></button>
                <hr></hr>
                <ContactsToCall />
            </div>

        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Peoples));
