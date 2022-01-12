import { useRef, useState } from 'react'
import { Formik, Form, Field } from 'formik';
import * as yup from 'yup'
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AlertMessage from './AlertMessage';
import AlertForgotPassword from './AlertForgotPassword';
import { actions } from '../../redux/actions';
import { firebase } from '../../services/firebase.service'

import './login.css'

const mapStateToProps = (state) => {
    return {
        openAlertMessage: state.materialsReducer.openAlertMessage,
    };
}

const mapDispatchToProps = (dispatch) => ({
    setOpenAlertMessage: (openAlertMessage) => dispatch(actions.setOpenAlertMessage(openAlertMessage)),
    getOneUser: (id) => dispatch(actions.getOneUser(id)),
    addOneUser: (user) => dispatch(actions.addOneUser(user)),
    setContacts: (contacts) => dispatch(actions.setContacts(contacts)),
});

const ByEmailAndPassword = (props) => {

    const { history } = props;
    const { setOpenAlertMessage, getOneUser, addOneUser, setContacts } = props;
    const [messageText, setMessageText] = useState('');
    const emailRef = useRef();
    const passwordRef = useRef();
    const [showAlertForgotPassword, setShowAlertForgotPassword] = useState(false);

    const loginSchema = yup.object().shape({
        email: yup.string().required('This field is required!').email('Invalid email!'),
        password: yup.string().required('This field is required!')
    });

    //כשהמשתמש חדש במערכת - הרשמתו ושמירה במסד נתונים
    //local storage וכן שמירה ב
    const submitSignInForm = () => {
        firebase.auth().signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
            .then((user) => {
                getOneUser(user.user.uid);
                //TODO Remove these lines when the code is work correctly.
                localStorage.removeItem('currentUserId');
                localStorage.setItem("currentUserId", user.user.uid);
                setContacts([]);
                history.push('/conversation')
            })
            .catch((error) => {
                setOpenAlertMessage(true);
                setMessageText(error.message);
                console.log(error.message);
            });
    }

    //localStorage כשהמשתמש קיים במערכת - שליפה של המשתמש וכן השמתו ב 
    const submitSignUpForm = () => {
        firebase.auth().createUserWithEmailAndPassword(emailRef.current.value, passwordRef.current.value)
            .then((user) => {
                addOneUser(user);
                //TODO Remove these lines when the code is work correctly.
                localStorage.removeItem('currentUserId');
                localStorage.setItem("currentUserId", user.user.uid);
                setContacts([]);
                history.push('/conversation');
            })
            .catch((error) => {
                setOpenAlertMessage(true);
                setMessageText(error.message);
                console.log(error.message);
            });
    }

    //אם שכח את הסיסמה שלו נשלחת לו הודעה למייל עם אפשרות של איפוס הסיסמה
    const resetUserPassword = () => {
        if (emailRef.current.value)
            setShowAlertForgotPassword(true);
        firebase.auth().sendPasswordResetEmail(emailRef.current.value)
            .then(() => {
                console.log("reset password successfuly!");
            })
            .catch((error) => {
                console.log("error with reset password: " + error);
            });
    }

    const disapearLoginMessage = () => {
        setMessageText('');
    }

    return (
        <div className="">
            <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={loginSchema}
            >
                <Form>
                    <div className="form-group">
                        <Field
                            className="form-control"
                            type="email"
                            placeholder="Email"
                            name="email"
                            id="emailInput"
                            innerRef={emailRef}
                            onFocus={disapearLoginMessage}
                        />
                        <i class="glyphicon glyphicon-eye-open"></i>
                        {/* <ErrorMessage className="alert alert-danger" name="email" component="div" /> */}
                    </div>

                    <div className="form-group passwordInputDiv">
                        <Field
                            className="form-control"
                            type="password"
                            placeholder="Password"
                            name="password"
                            id="passwordInput"
                            innerRef={passwordRef}
                            onFocus={disapearLoginMessage}
                        />
                        {/* <ErrorMessage className="alert alert-danger" name="email" component="div" /> */}
                    </div>
                </Form>
            </Formik >
            <div className="forgtPasswordDiv">
                <Link id="forgotPasswordLink" onClick={resetUserPassword} style={{ fontSize: "15px" }}>Forgot password?</Link>
            </div>
            <AlertForgotPassword show={showAlertForgotPassword} setShow={setShowAlertForgotPassword} />
            <div className="mt-4 signUpSignIn">
                <Link onClick={submitSignInForm} style={{ fontSize: "18px" }} className="signInLink">Sign in</Link>
                <Link onClick={submitSignUpForm} style={{ fontSize: "18px" }} className="signUpLink">Sign up</Link>
            </div>
            {messageText !== '' ? <AlertMessage message={messageText} /> : ""}
        </div>
    );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ByEmailAndPassword));