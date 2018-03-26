

export function detailsproject(state = { }, action) {
    switch (action.type) {
        case "SET_PROJECT_DETAILS":
            return { project_id: action.project_id};
        case "UNSET_PROJECT_DETAILS":
            return {};
        default:
            return state
    }
}