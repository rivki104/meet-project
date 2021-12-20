import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Sidebar } from 'primereact/sidebar';

import Header from '../general-components/Header';
import Conversation from './Conversation';
import ConversationActions from './ConversationActions';
import Chat from './Chat';

import 'primeicons/primeicons.css';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/saga-blue/theme.css';

import '../conversation/conversation.css';

function mapStateToProps(state) {
    return {
        currentUser: state.generalReducer.currentUser,
    };
}

function BasicPage(props) {

    const [visibleLeft, setVisibleLeft] = useState(false);

    return (
        <>
            {/* <div>
                <Sidebar visible={visibleLeft} baseZIndex={0} modal={false} onHide={() => setVisibleLeft(false)}>
                    <Chat />
                </Sidebar>
            </div> */}
            <div>
                <Header />
                <Conversation />
                <ConversationActions setVisibleLeft={setVisibleLeft} />
            </div>
        </>
    );
}

export default connect(mapStateToProps, null)(withRouter(BasicPage));