import React from "react";
import './viewprofile.css';
import staticImg from '../Images/ProfileImage.png';
import {connect} from "react-redux";
import {RESTService} from "../API";

class ViewProfilePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            profileImg: "",
            profileUser: ""
        };
    }
    componentWillMount()
    {
        console.log("###Fetch Profile Image in componentWillMount:");
        console.log("###this.props:");
        console.log(this.props);
        console.log("###this.:" + this.props.match.params.username);
        let username = this.props.match.params.username;
        console.log("this username",username);
        this.getProfileFromServer(username);
        this.getOtherUser(username);
    }
    componentDidMount() {

    }

    getProfileFromServer(username){
        RESTService.getProfileImage(username).then((res) => {
            console.log("###inside response:");
            this.setState({profileImg : res.img})
        });
    }

    getOtherUser(username){
        RESTService.getOtherUser(username).then((res) => {
            console.log("###inside response:");
            this.setState({profileUser : res.user})
        });
    }


    render() {
        const { user } = this.props;
        const { profileImg, profileUser } = this.state;
        console.log("##state values");
        var imgSrc = profileImg ? 'data:image/jpeg;base64,' + profileImg : staticImg;

        return (
            <div className="main-content">
                <div className="profile-info">
                    <div className="container-info">
                        <div className="grid-info">
                            <div className="grid-col">
                                <div className="row profile-info-card" id="shadowpanel">
                                    <div className="col-sm-3 col-md-3 col-lg-3 profile-avatar">
                                        <div className="profile-avatar-image" id="shadowpanel">
                                            <div className="profile-avatar-image-uploader">
                                                <div className="profile-avatar-image-wrapper">
                                                    <div className="profile-avatar-image-done" >
                                                        <img className="avatar-image" src={imgSrc} alt="Profile"/>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="profile-avatar-email-phone pad-down">
                                            <div>@{ profileUser.username }</div>
                                        </div>
                                        <div className="profile-avatar-email-phone pad-down">
                                            <div>{ profileUser.email }</div>
                                        </div>
                                        <div className="profile-avatar-email-phone">
                                            <div>
                                                <div className="edit-widget">
                                                    {profileUser.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-6 col-md-6 col-lg-6 profile-about">
                                        <div>
                                            <div className="profile-about-name-wrapper">
                                                <h1 className="profile-intro-username">
                                                    <div className="edit-widget">
                                                        {profileUser.name}
                                                    </div>
                                                </h1>
                                            </div>
                                            <div className="profile-user-byline">
                                                <div className="edit-widget">
                                                    {profileUser.summary}
                                                </div>
                                            </div>
                                            <div className="profile-about-wrapper">
                                                <div className="profile-about-description edit-widget"
                                                     id="about-me-display">
                                                    {profileUser.about_me}
                                                </div>
                                                <p>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-sm-3 col-md-3 col-lg-3 profile-stats">
                                        <h2 className="view-profile-stats-skills" >
                                            Top Skills
                                        </h2>
                                        {
                                            <div className="profile-skills edit-widget">
                                                {profileUser.skills}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state) {
    const { user } = state.authentication;
    return {
        user
    };
}

const connectedHomePage = connect(mapStateToProps)(ViewProfilePage);

export {connectedHomePage as ViewProfilePage};
