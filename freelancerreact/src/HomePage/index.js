import React from 'react';
import {connect} from 'react-redux';
import Banner from '../Images/Banner.png';
import Icon from '../Images/Freelancer Icon Short.png';
import ProfileImage from '../Images/ProfileImage.png';
import {history} from "../Helpers";
import {userActions} from "../Actions";



class HomePage extends React.Component {

    handleSubmit(push_page, e) {
        e.preventDefault();

        console.log(e.target.value);
        var project_id=e.target.value;
        const {dispatch} = this.props;
        dispatch({type: "UNSET"});
       // dispatch({type: "SET_PROJECT_DETAILS",project_id});
        history.push(push_page+"?project_id="+project_id);
    }
    componentWillMount(){
        const {dispatch} = this.props;
        dispatch({type: "HOME"});

    }

    render() {
        const {user} = this.props;
        console.log("User Details from Store-->");
        console.log(user);
        const {homecontent} = this.props;


        if (homecontent && homecontent.payload) {
            console.log("homecontent from store-->");
            console.log(homecontent);
            console.log(homecontent.payload);
            console.log(homecontent.payload.result);

        }
        return (
            <div>


                <div className="jumbotron">

                    <div>
                        <div className="col-sm-7 col-sm-offset-1">
                            <div className="col-md-12 col-md-offset-0">
                                <div className="panel panel-primary" id="shadowpanel">
                                    <img className="Banner" src={Banner} alt="BannerImage"/>
                                </div>

                                <div>

                                    <div className="panel panel-primary" id="shadowpanel">
                                        <div className="ProjectFeedTitle">

                                            <div className="col-sm-5 col-sm-offset-0">
                                                <h5><b>PROJECT/CONTEST</b></h5>
                                            </div>
                                            <div className="col-sm-2 col-sm-offset-0">
                                                <h5><b>BIDS/ENTRIES</b></h5>
                                            </div>
                                            <div className="col-sm-2 col-sm-offset-0">
                                                <h5><b>EMPLOYER</b></h5>
                                            </div>
                                            <div className="col-sm-2 col-sm-offset-0">
                                                <h5><b>PRICE</b></h5>
                                            </div>


                                        </div>


                                        {homecontent.payload &&
                                        homecontent.payload.result.map((data) =>


                                            <div className="ProjectFeed" key={data.project_id}>

                                                <div className="col-sm-1 col-sm-offset-0">

                                                    <img className="FreeLancerIcon" src={Icon} alt="FreelancerIcon"/>

                                                </div>
                                                <div className="col-sm-4 col-sm-offset-0">

                                                    <a href={`/BidProject?project_id=${data.project_id}`}> <span className="ProjectTitle"> {data.title}</span></a>
                                                    <br/>
                                                    <span className="ProjectDescription"> {data.description}</span>
                                                    <br/>
                                                    <br/>
                                                    <span className="ProjectSkillsReq"> {data.skills_req}</span>


                                                </div>
                                                <div className="col-sm-2 col-sm-offset-0">


                                                    {data.bid_count}


                                                </div>
                                                <div className="col-sm-2 col-sm-offset-0">

                                                    <span className="shiftsmallleft"><a href={`/ViewProfilePage/${data.emp_username}`}>@{data.emp_username}</a></span>

                                                </div>
                                                <div className="col-sm-3 col-sm-offset-0">

                                                    <span className="shiftsmallleft">{data.budget_range}</span>
                                                    <br/><br/>
                                                    <button className="btn btn-primary" id="BidProjectButton" value={data.project_id} onClick={this.handleSubmit.bind(this, "/BidProject")}>Bid Now
                                                    </button>

                                                </div>



                                            </div>
                                        )
                                        }


                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-sm-3 col-sm-offset-0">
                            <div className="col-md-12 col-md-offset-0">
                                <div className="panel panel-primary" id="shadowpanelUser">

                                    <div className="col-sm-5 col-sm-offset-0">
                                        <div className="col-md-12 col-md-offset-0">
                                            <img className="FreeLancerIcon" src={`http://localhost:3001/ProfileImage/${user.username}.jpg`} onError={(e)=>{e.target.src=ProfileImage}}/>
                                        </div>
                                    </div>


                                    <div className="col-sm-7 col-sm-offset-0">
                                        <div className="col-md-11 col-md-offset-0">
                                            <h5><b>Welcome back,</b></h5>
                                            <h4><b><a href={`/MyProfile`}>@{user.username}</a></b></h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>

        )
    }
}


function mapStateToProps(state) {
    const {user} = state.authentication;
    const {homecontent} = state;
    return {
        user,
        homecontent
    };
}

const connectedHomePage = connect(mapStateToProps)(HomePage);
export {connectedHomePage as HomePage};