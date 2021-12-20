import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import CustomAvatar from './CustomAvatar';
import { actions } from '../../redux/actions';

import './general.css'

function mapStateToProps(state) {
    return {
        currentUser: state.generalReducer.currentUser,
    };
}

const mapDispatchToProps = (dispatch) => ({
    getOneUser: (id) => dispatch(actions.getOneUser(id)),
    getContacts: (token) => dispatch({ type: 'GET_CONTACTS', payload: token }),
});

function Header(props) {

    const { currentUser } = props;
    const { getOneUser } = props;

    useEffect(() => {
        //את המשתמש האחרון שהתחבר כדי לחסוך התחברות מיותרת storage שליפה מה 
        if (currentUser === null && localStorage["currentUserId"] !== undefined) {
            getOneUser(localStorage.getItem("currentUserId"));
            // if (currentUser !== null && currentUser.googleProfile !== null)
            //     getContacts(currentUser.token);
        }
    }, []);

    return (
        <div className="header">
            {/* <div>{(window.location.href !== 'https://meet-app-project.herokuapp.com/' && currentUser !== null && currentUser !== '' && localStorage["currentUserId"] != "") ? <CustomAvatar /> : ""}</div> */}
            <div>{(window.location.href !== 'http://localhost:3000/' && currentUser !== null && currentUser !== '' && localStorage["currentUserId"] != "") ? <CustomAvatar /> : ""}</div>
        </div >
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Header));