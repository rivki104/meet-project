import { connect } from 'react-redux';

import { actions } from '../../redux/actions';

const mapStateToProps = (state) => {
    return {
        openAlertMessage: state.materialsReducer.openAlertMessage,
    };
}

const mapDispatchToProps = (dispatch) => ({
    setOpenAlertMessage: (openAlertMessage) => dispatch(actions.setOpenAlertMessage(openAlertMessage)),
});

function AlertMessage(props) {

    const { message, openAlertMessage } = props;
    const { setOpenAlertMessage } = props;

    return (
        <>
            {
                openAlertMessage ?
                    <div class="alert alert-primary " onClose={() => setOpenAlertMessage(false)} role="alert">
                        {message}
                    </div>
                    : ""
            }
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(AlertMessage);
