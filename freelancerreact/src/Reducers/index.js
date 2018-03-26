import {combineReducers} from 'redux';
import {authentication} from './authentication.reducer';
import {registration} from './registration.reducer';
import {alert} from './alert.reducer';
import {navbar} from './navbar';
import {homecontent} from './homecontent';
import{detailsproject} from './detailsproject'


const rootReducer = combineReducers({
    authentication,
    registration,
    alert,
    navbar,
    homecontent
});

export default rootReducer;