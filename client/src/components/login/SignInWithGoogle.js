import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import singInGoogleBtn from '../../assets/signGoogleBtn.png';
import { actions } from '../../redux/actions';
import { firebase } from '../../services/firebase.service'

import './login.css';

function mapStateToProps(state) {
    return {
        contacts: state.contactsReducer.contacts,
        serverURL: state.generalReducer.serverURL,
    };
}

const mapDispatchToProps = (dispatch) => ({
    setContacts: (contacts) => dispatch(actions.setContacts(contacts)),
    setCurrentUser: (user) => dispatch(actions.setCurrentUser(user)),
    getOneUser: (id) => dispatch(actions.getOneUser(id)),
    addOneUser: (user) => dispatch(actions.addOneUser(user)),
    getContacts: (token) => dispatch({ type: 'GET_CONTACTS', payload: token }),
});

function SignInWithGoogle(props) {

    const { history } = props;
    const { getOneUser, addOneUser, getContacts } = props;

    let provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    provider.addScope('https://www.googleapis.com/auth/contacts');

    //localStorage כניסה של המשתמש עם החשבון גוגל שלו וכן שמירתו או שליפתו מהמסד נתונים ומה
    const signinWithGoogle = () => {
        firebase.auth().signInWithPopup(provider).then(function (result) {
            let token = result.credential.accessToken;
            //TODO to change the ID to be encoded.
            localStorage.removeItem('currentUserId');
            localStorage.setItem("currentUserId", result.user.uid);
            if (result.additionalUserInfo.isNewUser) {
                addOneUser(result);
            }
            else {
                getOneUser(result.user.uid);
                localStorage.removeItem('currentUserId');
                localStorage.setItem("currentUserId", result.user.uid);
            }
            getContacts(token);
            history.push('/conversation');
        }).catch(function (error) {
            console.log(error);
        });
    }

    return (
        <div>
            {/* <button onClick={signinWithGoogle} className="btnSignInGoogle"><img alt="" src={singInGoogleBtn} style={{ width: "220px" }}></img></button> */}
            <img alt="" onClick={signinWithGoogle} className="btnSignInGoogle" src={singInGoogleBtn} style={{ width: "220px" }}></img>
        </div>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SignInWithGoogle));
