function convertActionTypeToName(actionType) {
    return actionType.toLowerCase().replace(/_(\w)/g, v => v[1].toUpperCase());
}

export default function createReducer(state, action, x) {
    const key = convertActionTypeToName(action.type);
    const handler = x[key];
    if (handler) {
        handler(state, action);
    }
}