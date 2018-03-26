import React from 'react';
import {connect} from 'react-redux';
import {history} from "../Helpers";
import ProfileImage from '../Images/ProfileImage.png';
import {RESTService} from "../API";

const queryString = require('query-string');


class HireProject extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            project_details: {
                "project_id": '',
                "emp_username": '',
                "title": '',
                "description": '',
                "budget_range": '',
                "skills_req": '',
                "complete_by_shortdate": '',
                "filenames": '',
                "name": ''
            },
            bid_table_data: {},
            bid_header: {
                "bid_count": '',
                "average_bid": '',
            },
            showtable: false,
            bid_price: '0',
            bid_date: '0',
            Project_Fee:'0',
            Your_Total_Bid:'0',
            Weekly_Milestone:'0',
            filenames:[]
        };

    };


    componentWillMount() {
        var parsed = queryString.parse(this.props.location.search);

        console.log(parsed.project_id);
        var Project_ID = parsed.project_id;

        const {dispatch} = this.props;


        RESTService.getBidDetails(Project_ID)
            .then(
                response => {
                    console.log("getBidDetails");
console.log(response.result);
                    this.setState({"bid_table_data": response.result});

                    if (response.result.length > 0)
                        this.setState({"showtable": true});
                },
                error => {
                    console.log("Error/fetchHomeProject:");
                    console.log(error);
                    localStorage.removeItem('user');
                    dispatch({type: "USERS_LOGOUT"});
                    RESTService.logout();
                    history.push('/Login');  //home page after session expire

                }
            );

        RESTService.getprojectdetails(Project_ID)
            .then(
                response => {

                    if (response.result.length === 0) {
                        dispatch({type: "HOME"});
                        history.push('/HomePage');  //home page if no project found
                    }
                    this.setState({"project_details": response.result[0]});

                    if(this.state.project_details.filenames && this.state.project_details.filenames.indexOf(",") > 0)
                        this.setState({"filenames": this.state.project_details.filenames.split(",")});
                    else
                        this.setState({"filenames": []});
                    console.log(this.state.filenames);
                    console.log(this.state.project_details);
                },
                error => {
                    console.log("Error/fetchHomeProject:");
                    console.log(error);
                    localStorage.removeItem('user');
                    dispatch({type: "USERS_LOGOUT"});
                    RESTService.logout();
                    history.push('/Login');  //home page after session expire

                }
            );


        RESTService.getBidHeader(Project_ID)
            .then(
                response => {
                    this.setState({"bid_header": response.result[0]});
                    console.log(this.state.project_details);
                },
                error => {
                    console.log("Error/fetchHomeProject:");
                    console.log(error);


                }
            );


    }


    handleSubmit( e) {
        e.preventDefault();
        console.log("Hit");
        console.log(e.target.value);
        console.log(this.state.project_details.project_id);

        var insert_Data = {
            freelancer_username:e.target.value,
            project_id:this.state.project_details.project_id,
        }

        RESTService.postFreelancer(insert_Data)
            .then(
                response => {
                    console.log(response);
                    window.alert('Success!');
                    history.push("/HomePage")

                },
                error => {
                    console.log("Error/fetchHomeProject:");
                    console.log(error);
                }
            );


    }


    render() {


        return (
            <div>
                <div className="jumbotron">
                    <div className="col-sm-8 col-sm-offset-2">
                        <div className="col-md-12 col-md-offset-0">
                            <span className="ProjectTitleBid"> {this.state.project_details.title}</span>
                        </div>
                    </div>

                    <div className="col-sm-8 col-sm-offset-2">
                        <div className="col-md-12 col-md-offset-0">


                            <div className="panel panel-primary" id="shadowpanel">
                                <div className="ProjectDetailHeader">

                                    <div className="col-sm-2 col-sm-offset-0" id="ProjectDetailBox">

                                        <span>Bids</span>
                                        <br/><span
                                        className="ProjectHeaderValue">{this.state.bid_header.bid_count}</span>

                                    </div>
                                    <div className="col-sm-2 col-sm-offset-0" id="ProjectDetailBox">


                                        <span>Avg Bid</span>
                                        <br/><span
                                        className="ProjectHeaderValue">{Number(this.state.bid_header.average_bid).toFixed(2)}$</span>
                                    </div>
                                    <div className="col-sm-2 col-sm-offset-0" id="ProjectDetailBox">


                                        <span>Project Budget </span>
                                        <br/><span
                                        className="ProjectHeaderValue">{this.state.project_details.budget_range}</span>
                                    </div>
                                    <div className="col-sm-5 col-sm-offset-0" id="ProjectDetailBoxEnd">
                                        <span>Expected</span>
                                        <br/><span
                                        className="ProjectHeaderValue">{this.state.project_details.complete_by_shortdate}</span>

                                    </div>

                                </div>
                            </div>




                            <div className="panel panel-primary" id="shadowpanel">
                                <div className="ProjectDetails">

                                    <div className="col-sm-8 col-sm-offset-0">

                                        <span className="ProjectTitleSubheading"> Project Description </span>
                                        <br/>
                                        <span>{this.state.project_details.description}</span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading"> Employer</span>
                                        <br/>
                                        <span>{this.state.project_details.name}<br/>@{this.state.project_details.emp_username}</span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading"> Skills Required</span>
                                        <span>{this.state.project_details.skills_req}</span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading">Files</span>
                                        <span>{
                                            this.state.filenames.map((data) =>
                                              <div key={data}>
                                               <a target="_blank" href={`http://localhost:3001/project_files/${this.state.project_details.emp_username}/${data}`}>
                                                  {data}
                                                </a>
                                                <br/>
                                              </div>
                                            )


                                        }</span>
                                        <br/>

                                    </div>
                                    <div className="col-sm-4 col-sm-offset-0">


                                        <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/><br/> <br/> <br/> <br/> <br/>
                                        <br/> <br/>
                                        <span id="textrightshift100"><b>Project Id:</b></span>{this.state.project_details.project_id}
                                    </div>

                                </div>
                            </div>


                            <div className="panel panel-primary" id="shadowpanel">
                                <div className="BidDetailsTable">

                                    <table className="m-table">
                                        <thead>
                                        <tr>
                                            <th>Profile Image</th>
                                            <th>Freelancer Name</th>
                                            <th>Bid Price</th>
                                            <th>Period Days</th>
                                            <th></th>
                                        </tr>
                                        </thead>
                                        <tbody>


                                        {
                                            !this.state.showtable &&
                                            <tr>
                                                <td>No one has bid yet!</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }
                                        {this.state.showtable &&
                                        this.state.bid_table_data.map((data) =>
                                            <tr key={data.id}>
                                                <td> <img className="ProfileImageIcon" src={`http://localhost:3001/ProfileImage/${data.username}.jpg`} onError={(e)=>{e.target.src=ProfileImage}}/></td>
                                                <td>{data.name}{' '}@{data.username}</td>
                                                <td>{data.bid_price} USD</td>
                                                <td>{data.days_req} days</td>
                                                <td><button className="btn btn-primary" id="BidProjectButton" value={data.username} onClick={this.handleSubmit.bind(this)}>Hire
                                                </button></td>


                                            </tr>
                                        )
                                        }


                                        </tbody>
                                    </table>

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
    const {user} = state.authentication;
    return {
        user,
    };
}

const connectedHireProject = connect(mapStateToProps)(HireProject);
export {connectedHireProject as HireProject};