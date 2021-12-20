import React from 'react';
import { connect } from 'react-redux';
import { Button, Modal } from 'react-bootstrap';

import './lastConversation.css';

const mapStateToProps = (state) => {
    return {
        currentRecord: state.recordReducer.currentRecord,
    };
}

function RecordDetails(props) {

    const { showRecordModal, recordUrl, currentRecord, } = props;
    const { setShowRecordModal } = props;

    const handleClose = () => setShowRecordModal(false);

    return (
        <div>
            <Modal size="md" show={showRecordModal} onHide={handleClose} dialogClassName="addContactModal">
                <div div="addContactModalDiv">
                    <Modal.Header closeButton>
                        <Modal.Title className="text-center">Record details</Modal.Title>
                    </Modal.Header>
                    {currentRecord ?
                        <Modal.Body>
                            <p>Begin Time: {currentRecord.beginDate.split(" ")[0]}</p>
                            {currentRecord.finishDate ?
                                <p>End Time: {currentRecord.finishDate.split(" ")[0]}</p>
                                : ""}
                            <video src={recordUrl} controls={true} width='290px' height="220px" className="ml-5"></video>
                        </Modal.Body> : ""}
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Close</Button>
                    </Modal.Footer>
                </div>
            </Modal>
        </div>
    );
}

export default connect(mapStateToProps, null)(RecordDetails);