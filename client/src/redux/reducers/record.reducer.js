import produce from 'immer';

import createReducer from './reducerUtils';

const initialState = {
    currentRecord: '',
}

const recordsData = {
    setCurrentRecord(state, action) {
        state.currentRecord = action.payload;
    },
}

export default produce((state, action) => createReducer(state, action, recordsData), initialState);