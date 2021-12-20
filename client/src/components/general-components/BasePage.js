import React, { useEffect } from 'react';
import { connect } from "react-redux";
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from '../routes/Routes';

function mapStateToProps(state) {
    return {
        currentUser: state.generalReducer.currentUser,
        contacts: state.contactsReducer.contacts,
    };
}

const mapDispatchToProps = (dispatch) => ({
    getContacts: (token) => dispatch({ type: 'GET_CONTACTS', payload: token }),
});

function BasePage(props) {

    const { currentUser } = props;

    useEffect(() => {
        // במקרה בו יש משתמש לשלוף את האנשי קשר מחשבון גוגל שלו
        // if (currentUser !== null && contacts.length === 0)
        //     getContacts(currentUser.token);
    }, [currentUser])

    return (
        <Router>
            <div className="App">
                <Routes></Routes>
            </div>
        </Router>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(BasePage);