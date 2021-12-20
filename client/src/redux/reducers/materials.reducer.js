import produce from 'immer';

import createReducer from './reducerUtils';

const initialState = {
    openAlertMessage: false,
}

const materialsData = {
    setOpenAlertMessage(state, action) {
        state.openAlertMessage = action.payload;
    },
}

export default produce((state, action) => createReducer(state, action, materialsData), initialState);