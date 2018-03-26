

export function homecontent(state = { }, action) {
    switch (action.type) {
        case "SET_DATA":
            return { payload: action.result };
        case "UNSET":
            return {};
        default:
            return state
    }
}