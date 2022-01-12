import React from 'react';
import { Button, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Contacts from './Contacts';
import { actions } from '../../redux/actions';

import './contacts.css';

function mapStateToProps(state) {
    return {
        showContactsModal: state.contactsReducer.showContactsModal,
    };
}

const mapDispatchToProps = (dispatch) => ({
    setShowContactsModal: (showContactsModal) => dispatch(actions.setShowContactsModal(showContactsModal)),
});

function AddContactsModal(props) {
    const { showContactsModal } = props;
    const { setShowContactsModal } = props;

    //סגירת המודל של האנשי קשר
    const handleClose = () => setShowContactsModal(false);

    return (
        <div>
            <Modal size="md" className="text-center addContactsModal" show={showContactsModal} onHide={handleClose} dialogClassName="addContactModal">
                <div div="addContactModalDiv">
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">Adding people</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Contacts />
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>

    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AddContactsModal));

