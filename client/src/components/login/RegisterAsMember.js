import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import './login.css'

const mapStateToProps = (state) => {
    return {
    };
}

const mapDispatchToProps = (dispatch) => ({
});

const RegisterAsMember = (props) => {

    return (
        <div className="border rounded primary">
            <h1>Do you want to register as a member of our site?</h1>
            <Link to="/"></Link>
            <Link to="/">Continue without register</Link>
        </div>
    );
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(RegisterAsMember));