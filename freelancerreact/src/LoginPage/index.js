import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import fllogo from '../Images/Logo.png';

import { userActions } from '../Actions';


class LoginPage extends React.Component {
    constructor(props) {
        super(props);

        // reset login status
       // this.props.dispatch(userActions.logout());

        this.state = {
            username: '',
            password: '',
            submitted: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("Handle login submit");
        this.setState({ submitted: true });
        const { username, password } = this.state;
        const { dispatch } = this.props;
        if (username && password) {
            dispatch(userActions.login(username, password));
        }
    }

    render() {

        const { username, password, submitted } = this.state;
        const { alert }=this.props;
        return (
            <div className="jumbotron">
            <div className="container">
            <div className="col-sm-8 col-sm-offset-2">
            <div className="col-md-6 col-md-offset-3">

                <div className="panel panel-primary" id="shadowpanel">

                    <div className="panel-body">
                        <div className="div-fl-logo"> <img className="fl-logo" src={fllogo} alt="Freelancer" /></div>


                        {
                            alert.message &&
                            <aside className={`alert ${alert.type}`}>{alert.message}</aside>
                        }

                <form name="form" onSubmit={this.handleSubmit}>
                    <div className={'form-group' + (submitted && !username ? ' has-error' : '')}>
                        <label htmlFor="username">Username</label>
                        <input type="text" className="form-control" name="username" value={username} onChange={this.handleChange} />
                        {submitted && !username &&
                        <div className="help-block">Username is required</div>
                        }
                    </div>
                    <div className={'form-group' + (submitted && !password ? ' has-error' : '')}>
                        <label htmlFor="password">Password</label>
                        <input type="password" className="form-control" name="password" value={password} onChange={this.handleChange} />
                        {submitted && !password &&
                        <div className="help-block">Password is required</div>
                        }
                    </div>

                    <div className="form-group" id="LoginButtonDiv">
                        <button className="btn btn-primary" id="LoginButton">Login</button>

                    </div >
                    <div id="smallLabeldiv">
                    <p id="smallLabel">Don't have an account?<Link to="/register" className="btn btn-link" id="linkHelper">Register</Link></p>
                    </div>
                </form>

                    </div> </div> </div></div></div></div>
        );
    }
}

function mapStateToProps(state) {
    const { loggingIn } = state.authentication;
    const { alert } = state;
    return {
        loggingIn,alert
    };
}

const connectedLoginPage = connect(mapStateToProps)(LoginPage);
export { connectedLoginPage as LoginPage };