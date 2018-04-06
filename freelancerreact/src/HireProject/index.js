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
                "_id": {
                    "id": '',
                    "emp_username": '',
                    "title": '',
                    "description": '',
                    "budget_range": '',
                    "skills_req": '',
                    "complete_by_shortdate": '',
                    "filenames": '',
                    "name": ''
                }
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
            filenames:[],
            project_status: true,
        };

    };


    componentWillMount() {
        var parsed = queryString.parse(this.props.location.search);

        console.log(parsed.project_id);
        var Project_ID = parsed.project_id;

        const {dispatch} = this.props;


        RESTService.getBidDetails(Project_ID).then(
            response => {
console.log("bid details-");
                console.log(response.result);

                this.setState({"bid_table_data": response.result});
                if (response.result.length > 0 && response.result[0].bids)
                    this.setState({"showtable": true});

            },
            error => {

                console.log("Error/fetchHomeProject:");
                console.log(error);
                localStorage.removeItem('user');
                dispatch({type: "USERS_LOGOUT"});
                RESTService.logout();
                history.push('/Login');  //Login page after session expire
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

                    if(this.state.project_details._id.filenames && this.state.project_details._id.filenames.indexOf(",") > 0)
                        this.setState({"filenames": this.state.project_details._id.filenames.split(",")});
                    else
                        this.setState({"filenames": []});
                    if (this.state.project_details._id.status === "Assigned")
                    {
                        this.setState({"project_status": false});
                    }
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




    }


    handleSubmit( e) {
        e.preventDefault();

        var insert_Data = {
            freelancer_username: e.target.value,
            project_id: this.state.project_details._id.id,
        };


        RESTService.postFreelancer(insert_Data)
            .then(
                response => {
                    console.log(response);
                    window.alert('Success!');
                    history.push("/dashboard")

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
                            <span className="ProjectTitleBid"> {this.state.project_details._id.title}</span>
                        </div>
                    </div>

                    <div className="col-sm-8 col-sm-offset-2">
                        <div className="col-md-12 col-md-offset-0">


                            <div className="panel panel-primary" id="shadowpanel">
                                <div className="ProjectDetailHeader">

                                    <div className="col-sm-2 col-sm-offset-0" id="ProjectDetailBox">

                                        <span>Bids</span>
                                        <br/><span
                                        className="ProjectHeaderValue">       {this.state.project_details._id.bid_count}</span>

                                    </div>
                                    <div className="col-sm-2 col-sm-offset-0" id="ProjectDetailBox">


                                        <span>Avg Bid</span>
                                        <br/><span
                                        className="ProjectHeaderValue">   {Number(this.state.project_details.avg_bid).toFixed(2)}$</span>
                                    </div>
                                    <div className="col-sm-2 col-sm-offset-0" id="ProjectDetailBox">


                                        <span>Project Budget </span>
                                        <br/><span
                                        className="ProjectHeaderValue">       {this.state.project_details._id.budget_range}</span>
                                    </div>
                                    <div className="col-sm-5 col-sm-offset-0" id="ProjectDetailBoxEnd">
                                        <span>Expected</span>
                                        <br/><span
                                        className="ProjectHeaderValue">{this.state.project_details._id.complete_by}</span>

                                    </div>

                                </div>
                            </div>




                            <div className="panel panel-primary" id="shadowpanel">
                                <div className="ProjectDetails">

                                    <div className="col-sm-8 col-sm-offset-0">

                                        <span className="ProjectTitleSubheading"> Project Description </span>
                                        <br/>
                                        <span>{this.state.project_details._id.description}</span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading"> Employer</span>
                                        <br/>
                                        <span>    {this.state.project_details.name}<br/>   <a href={`/ViewProfile/${this.state.project_details._id.emp_username}`}>@{this.state.project_details._id.emp_username}</a></span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading"> Skills Required</span>
                                        <span>{this.state.project_details._id.skills_req}</span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading">Files</span>
                                        <span>{
                                            this.state.filenames.map((data) =>
                                              <div key={data}>
                                               <a target="_blank" href={`http://localhost:3001/project_files/${this.state.project_details._id.emp_username}/${data}`}>
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
                                        <span><b>Project Id:</b></span>{this.state.project_details._id.id}
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
                                            <tr key={data._id + data.bids.username}>
                                                <td> <img className="ProfileImageIcon" src={`http://localhost:3001/ProfileImage/${data.bids.username}.jpg`} onError={(e)=>{e.target.src=ProfileImage}}/></td>
                                                <td>         <p className="mb-0">{data.bids.name}</p>
                                                    <a href={`/ViewProfile/${data.bids.username}`}> @{data.bids.username}</a></td>
                                                <td>{data.bids.bid_price} USD</td>
                                                <td>{data.bids.days_req} days</td>
                                                <td>
                                                { (data.bids.username===this.state.project_details._id.freelancer_username) &&
                                                <span>Hired</span>
                                                }
                                                    { !(data.bids.username===this.state.project_details._id.freelancer_username)  &&
                                                    <button className="btn btn-primary" id="BidProjectButton" value={data.bids.username} onClick={this.handleSubmit.bind(this)}>Hire
                                                    </button>
                                                    }
                                        </td>


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