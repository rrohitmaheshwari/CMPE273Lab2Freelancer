import {userConstants} from '../Constants';
import {RESTService} from '../API';
import {alertActions} from './';
import {history} from '../Helpers';


export const userActions = {

    login,
    logout,
    register,
    fetchHomeProject,
    getByUserName,

};


function login(username, password) {
    return dispatch => {
        dispatch(request({username}));

        RESTService.login(username, password)
            .then(
                user => {
                    console.log("user");
                    console.log(user);
                    dispatch(success(user));
                    dispatch({type: "HOME"});
                    history.push('/HomePage');  //home page after login
                },
                error => {
                    console.log(error);
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));
                }
            );
    };

    function request(user) {
        return {type: "USERS_LOGIN_REQUEST", user}
    }

    function success(user) {
        return {type: "USERS_LOGIN_SUCCESS", user}
    }

    function failure(error) {
        return {type: "USERS_LOGIN_FAILURE", error}
    }


}

function logout() {


    RESTService.logout();
    return {type: "USERS_LOGOUT"};
}

function register(user) {
    return (dispatch) => {
        // dispatch(request(user));

        RESTService.register(user)
            .then(
                user => {
                    //dispatch(success());
                    history.push('/login');
                    dispatch(alertActions.success('Registration successful'));
                },
                error => {
                    console.log(error);
                    dispatch(failure(error));
                    dispatch(alertActions.error(error));

                }
            );
    };

    //  function request(user) { return { type: userConstants.REGISTER_REQUEST, user } }
    // function success(user) { return { type: userConstants.REGISTER_SUCCESS, user } }
    function failure(error) {
        return {type: userConstants.REGISTER_FAILURE, error}
    }
}


function fetchHomeProject(user) {


    return dispatch => {
        RESTService.fetchHomeProject(user)
            .then(
                result => {
                    console.log("user result");
                    console.log(result);
                    console.log("user result.result");
                    console.log(result.result);
                    dispatch({type: 'SET_DATA', result});
                    return result;
                },
                error => {
                    console.log("Error/fetchHomeProject:");
                    console.log(error);

                    localStorage.removeItem('user');
                    dispatch({type: "USERS_LOGOUT"});
                    dispatch({type: "UNSET"});
                    RESTService.logout();
                    history.push('/Login');  //home page after session expire
                    return error;
                }
            );
    };


}

function getByUserName() {
    return dispatch => {
        console.log("###Action in");
        // Calling backened API
        RESTService.getByUserName()
            .then(
                user => {
                    console.log("###Action. ok:");
                    localStorage.removeItem('user');
                    localStorage.setItem('user', JSON.stringify(user.user));
                    dispatch(success(user.user));
                }
            );
    };

    function success(user) { return { type: "USERS_LOGIN_SUCCESS", user } }
}


