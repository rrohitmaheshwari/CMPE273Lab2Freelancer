import React from 'react';
import {Router, Route} from 'react-router-dom';
import {connect} from 'react-redux';

import {history} from '../Helpers';
import { userActions,alertActions} from '../Actions';


import {LoginPage} from '../LoginPage';
import {RegisterPage} from '../RegisterPage';

import {HomePage} from '../HomePage';
import {DashboardPage} from "../Dashboard";
import {MyProfile} from "../MyProfile";
import {PostProject} from "../PostProject";
import {BidProject} from "../BidProject";
import {HireProject} from "../HireProject";
import {ViewProfilePage} from "../ViewProfilePage";







import fllogo from '../Images/Logo.png';

class App extends React.Component {
    constructor(props) {
        super(props);
        const { dispatch } = this.props;
        history.listen((location, action) => {

            dispatch(alertActions.clear());
        });
        this.handleLogout = this.handleLogout.bind(this);

    }

    handleSubmit(push_page, dispatch_setter, e) {
        e.preventDefault();
        const {dispatch} = this.props;
        dispatch({type: dispatch_setter});
        history.push(push_page);
    }

    handleLogout(e) {
        e.preventDefault();

        console.log("Logging out...");
        const {dispatch} = this.props;
        dispatch(userActions.logout());
        dispatch({type: "UNSET"});
        history.push('/login');

    }

    componentWillMount(){
        const { dispatch } = this.props;
        dispatch(userActions.getByUserName());
    }
    render() {
        const { user, navbar} = this.props;
        var homepage = false, dashboardpage = false, profilepage = false;
        if (user) {
            if (navbar.page === "home") {
                homepage = true;
                const { dispatch } = this.props;
                dispatch(userActions.fetchHomeProject(this.props.user));
            }
            else if (navbar.page === "dashboard")
            { dashboardpage = true;
            }
            else if (navbar.page === "profile")
            {  profilepage = true;
            }

        }

        console.log("homepage:" + homepage);
        console.log("dashboardpage:" + dashboardpage);

        console.log("####user from App:" + user);
        // console.log("####user.tostring from App:"+user.toString());
        return (

            <div>

                {
                    user &&

                    <nav className="navbar navbar-inverse">

                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle" data-toggle="collapse"
                                    data-target="#myNavbar">
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                                <span className="icon-bar"></span>
                            </button>
                        </div>
                        <div className="collapse navbar-collapse" id="myNavbar">
                            <ul className="nav navbar-nav">
                                <li className="image-li"><img className="li-fl-logo " src={fllogo}
                                                              alt="Freelancer"/></li>
                                {!homepage &&
                                <li onClick={this.handleSubmit.bind(this, "/HomePage", "HOME")}><a>Home</a></li>
                                }
                                {homepage &&
                                <li onClick={this.handleSubmit.bind(this, "/HomePage", "HOME")} className="active"><a>Home</a>
                                </li>
                                }


                                {!dashboardpage &&
                                <li onClick={this.handleSubmit.bind(this, "/dashboard", "DASHBOARD")}><a>Dashboard</a>
                                </li>
                                }
                                {dashboardpage &&
                                <li onClick={this.handleSubmit.bind(this, "/dashboard", "DASHBOARD")}
                                    className="active"><a>Dashboard</a></li>
                                }


                                {!profilepage &&
                                <li onClick={this.handleSubmit.bind(this, "/MyProfile", "MY_PROFILE")}><a>My Profile</a>
                                </li>
                                }
                                {profilepage &&
                                <li onClick={this.handleSubmit.bind(this, "/MyProfile", "MY_PROFILE")}
                                    className="active"><a>My Profile</a></li>
                                }


                            </ul>
                            <ul className="nav navbar-nav navbar-right">


                                <li>
                                    <button className="btn btn-primary" id="PostProjectButton"
                                            onClick={this.handleSubmit.bind(this, "/PostProject", "POST_A_PROJECT")}>Post a
                                        Project
                                    </button>
                                </li>


                                <li><a onClick={this.handleLogout}><span className="glyphicon glyphicon-log-in"></span>Logout</a>
                                </li>
                            </ul>

                        </div>
                    </nav>
                }


                <Router history={history}>
                    <div>
                        {!user ? <Route exact path="/" component={LoginPage}/> :
                            <Route exact path="/" component={HomePage}/>}
                        {!user ? <Route exact path="/HomePage" component={LoginPage}/> :
                            <Route exact path="/HomePage" component={HomePage}/>}
                        {!user ? <Route exact path="/login" component={LoginPage}/> :
                            <Route exact path="/login" component={HomePage}/>}
                        {!user ? <Route exact path="/register" component={RegisterPage}/> :
                            <Route exact path="/register" component={HomePage}/>}
                        {!user ? <Route exact path="/dashboard" component={LoginPage}/> :
                            <Route exact path="/dashboard" component={DashboardPage}/>}
                        {!user ? <Route exact path="/MyProfile" component={LoginPage}/> :
                            <Route exact path="/MyProfile" component={MyProfile}/>}
                        {!user ? <Route exact path="/PostProject" component={LoginPage}/> :
                            <Route exact path="/PostProject" component={PostProject}/>}
                        {!user ? <Route startsWith path="/BidProject" component={LoginPage}/> :
                            <Route startsWith path="/BidProject" component={BidProject}/>}
                        {!user ? <Route startsWith path="/HireProject" component={LoginPage}/> :
                            <Route startsWith path="/HireProject" component={HireProject}/>}
                        {!user ? <Route exact path="/ViewProfilePage/:username" component={LoginPage}/> :
                            <Route exact path="/ViewProfilePage/:username" component={ViewProfilePage}/>}


                    </div>
                </Router>
            </div>

        );
    }
}

function mapStateToProps(state) {

    const {user} = state.authentication;
    const {navbar} = state;
    return {

        user,
        navbar
    };
}

const connectedApp = connect(mapStateToProps)(App);
export {connectedApp as App};


