

export function navbar(state = {page: 'home'}, action) {
    switch (action.type) {
        case "HOME":
            return { page: 'home' };
        case "DASHBOARD":
            return { page: 'dashboard' };
        case "MY_PROFILE":
            return { page: 'profile' };
        case "POST_A_PROJECT":
            return { page: 'post_a_project' };
        case "TRANSACTION":
            return { page: 'transaction_page' };
        case "BID_NOW":
            return { page: 'bid_page' };
        case "HIRE_NOW":
            return { page: 'hire_page' };
        case "UNSET":
            return {};
        default:
            return state
    }
}