import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';

import LogOut from './LogOut';
import Profile from './Profile';

function mapStateToProps(state) {
    return {
        currentUser: state.generalReducer.currentUser,
    };
}

function CustomAvatar(props) {

    const { currentUser } = props;
    const [showLogOut, setShowLogOut] = useState(false);
    const [avatarContent, setAvatartContent] = useState()

    useEffect(() => {
        setAvatartContent(currentUser.email);
    }, [currentUser]);

    //Title
    $(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })

    $('Avatar').tooltip();

    return (
        <div>
            {/* אם יש לו תמונת פרופיל ישתמש בה אם לא יצור אותיות */}
            {/* {currentUser && currentUser.picture ? avatarImgaes : avatarLetters} */}
            {/* </div> */}
            <div style={{ position: 'absolute', right: '7%', top: '10%' }} data-toggle="tooltip" data-placement="bottom" title={avatarContent} onClick={() => setShowLogOut(true)} >
                <Profile />
            </div>
            <LogOut showLogOut={showLogOut} setShowLogOut={setShowLogOut} />
        </div>
    );
}

export default connect(mapStateToProps, null)(CustomAvatar);