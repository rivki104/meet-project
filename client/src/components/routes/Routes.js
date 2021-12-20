import { BrowserRouter as Router, Route } from 'react-router-dom';

import Contacts from '../contacts/Contacts';
import BasicConversationPage from '../conversation/BasicConversationPage';
import LastConversations from '../history/LastConversations';
import Home from '../general-components/Home';
import EndScreen from '../general-components/EndScreen';

function Routes(props) {
    return (
        <div>
            <Router>
                <Route exact path="/" component={Home} />
                <Route path="/contacts" component={Contacts} />
                {/* <Route path="/connection/#:room" component={BasicConversationPage} /> */}
                <Route path="/conversation" component={BasicConversationPage} />
                <Route path="/lastConversations" component={LastConversations} />
                <Route path="/endScreen" component={EndScreen} />
            </Router>
        </div>
    );
}

export default Routes;