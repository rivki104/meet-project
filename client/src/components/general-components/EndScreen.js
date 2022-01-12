import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import RatingStars from './RatingStars';
import Header from './Header';
import { withRouter } from 'react-router-dom';

import './general.css'
import 'bootstrap-icons/font/bootstrap-icons';

const mapStateToProps = (state) => {
    return {
        isCaller: state.conversationReducer.isCaller,
    };
}

function EndScreen(props) {

    const { isCaller } = props;

    return (
        <div className="endScreen">
            <Header />
            <div className="endScreenContent">
                <br></br>
                {isCaller ?
                    <div>
                        <h1>You left the meeting</h1>
                        <br></br>
                        <Link to="/lastConversations" className="mt-5">last conversations</Link>
                        <br></br><br></br>
                        <Link to="/conversation" className="mt-5">new conversation</Link>
                        <br></br>
                        <p className="mt-5">How much did you like using our app?</p>
                        {/* כוכבים לדרוג */}
                        <RatingStars />
                        <br></br>
                        <h5 className="mt-5">Thank you for using our app</h5>
                    </div>
                    :
                    <div className="partisipantEndScreen">
                        <br></br><br></br>
                        <h1 className="mt-5">The meeting was hung up!</h1>
                        <br></br>
                        <h1>See you!!</h1>
                    </div>
                }
            </div>
        </div>
    );
}

export default connect(mapStateToProps)(withRouter(EndScreen));