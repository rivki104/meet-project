import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Login from '../login/Login';
import Header from './Header';
import BasicConversationPage from '../conversation/BasicConversationPage';
import { actions } from '../../redux/actions';

import './home.css';

const mapStateToProps = (state) => {
    return {
    };
}

const mapDispatchToProps = (dispatch) => ({
    setRoomId: (roomId) => dispatch(actions.setRoomId(roomId)),
});

function Home(props) {

    const { setRoomId } = props;
    const [connectionFlag, setConnectionFlag] = useState(false)

    useEffect(() => {
        if (window.location.href.includes('connection')) {
            setConnectionFlag(true)
            let room = window.location.href.slice(window.location.href.lastIndexOf('/') + 1);
            setRoomId(room);
        }
    })

    return (
        <>{
            connectionFlag ?
                <BasicConversationPage />
                :
                <div className="homePage">
                    <div className="col-3">
                    </div>
                    <Header />
                    <div className="col-6 offset-2">
                        <Login />
                    </div>
                </div>}
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);