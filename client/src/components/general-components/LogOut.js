import React from 'react';
import { connect } from 'react-redux';
import { signOut } from '../../services/firebase.service';
import { withRouter } from 'react-router-dom';
import { Toast, Row, Col } from 'react-bootstrap';
import { actions } from '../../redux/actions';
import Profile from './Profile';

function mapStateToProps(state) {
    return {
        currentUser: state.generalReducer.currentUser,
    };
}

const mapDispatchToProps = (dispatch) => ({
    setCurrentUser: (currentUser) => dispatch(actions.setCurrentUser(currentUser)),
});

function LogOut(props) {
    const { history } = props;
    const { currentUser, setCurrentUser } = props;

    //יציאה מהחשבון המחובר כעת
    const logOutFunc = () => {
        signOut();
        history.push('./endScreen');
        setCurrentUser(null);

    }

    return (
        <div>
            <Row>
                <Col xs={13}>
                    <Toast className="logOutModal" onClose={() => props.setShowLogOut(false)} show={props.showLogOut} delay={5000} autohide>
                        <Toast.Header className="text-center logOutToastHeader">
                            <br></br>
                            <strong className="mr-auto picAccount">
                                <Profile />
                            </strong>
                        </Toast.Header>
                        <Toast.Body>

                            <div style={{ fontWeight: "bold" }} className="currentUserName">{currentUser.name}</div>
                            <div>{currentUser.email}</div>
                            <button onClick={logOutFunc} className="signOutButton bg-white mt-3">Log out of the account</button>
                        </Toast.Body>
                    </Toast>
                </Col>
            </Row>
        </div>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(LogOut));