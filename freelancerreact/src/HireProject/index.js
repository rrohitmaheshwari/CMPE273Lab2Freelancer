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
            Project_Fee: '0',
            Your_Total_Bid: '0',
            Weekly_Milestone: '0',
            filenames: [],
            freelancer_files: [],
            project_status: true,
            sort: {
                column: null,
                direction: 'desc',
            },
            status_Submitted: false,
            status_Closed:false,
            freelancer_fees: 0,
            sum: 0,
        };

    };


    componentWillMount() {
        var parsed = queryString.parse(this.props.location.search);

        console.log(parsed.project_id);
        var Project_ID = parsed.project_id;

        const {dispatch,user} = this.props;

        dispatch({type: "HIRE_NOW"});

        RESTService.getprojectdetails(Project_ID)
            .then(
                response => {

                    if (response.result.length === 0) {
                        dispatch({type: "HOME"});
                        history.push('/HomePage');  //home page if no project found
                    }
                    this.setState({"project_details": response.result[0]});

                    if (this.state.project_details._id.filenames && this.state.project_details._id.filenames.indexOf(",") > 0)
                        this.setState({"filenames": this.state.project_details._id.filenames.split(",")});
                    else
                        this.setState({"filenames": []});


                    if (this.state.project_details._id.freelancer_files && this.state.project_details._id.freelancer_files.indexOf(",") > 0)
                        this.setState({"freelancer_files": this.state.project_details._id.freelancer_files.split(",")});
                    else
                        this.setState({"freelancer_files": []});

                    if (this.state.project_details._id.status === "Assigned") {
                        this.setState({"project_status": false});
                    }
                    if (this.state.project_details._id.status === "Submitted") {
                        this.setState({"status_Submitted": true});
                    }

                    if (this.state.project_details._id.status === "Closed") {
                        this.setState({"status_Closed": true});
                    }


                    console.log(this.state.filenames);
                    console.log(this.state.project_details);


                    RESTService.getBidDetails(Project_ID).then(
                        response_inside => {
                            console.log("bid details-");
                            console.log(response_inside.result);

                            this.setState({"bid_table_data": response_inside.result});
                            if (response_inside.result.length > 0 && response_inside.result[0].bids) {
                                this.setState({"showtable": true});


                                for (var i = 0; i < response_inside.result.length; i++) {
                                    console.log(response.result[0]._id.freelancer_username);
                                    console.log(response_inside.result[i].bids.username);

                                    if (response.result[0]._id.freelancer_username === response_inside.result[i].bids.username) {
                                        this.setState({"freelancer_fees": response_inside.result[i].bids.bid_price});
                                        break;
                                    }

                                }


                            }

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


        RESTService.getMyTransactionDetails()
            .then(
                response => {


                    var sum = 0;

                    for (var i = 0; i < response.result.length; i++) {
                        if (response.result[i].type === "Add") {

                            sum += response.result[i].amount;
                        }
                        else if (response.result[i].type === "Withdraw") {

                            sum -= response.result[i].amount;
                        }
                        else if (response.result[i].type === "Transfer" && response.result[i].from === user.username) {

                            sum -= response.result[i].amount;
                        }
                        else if (response.result[i].type === "Transfer" && response.result[i].to === user.username) {

                            sum += response.result[i].amount;
                        }
                    }
                    this.setState({sum: sum});


                },
                error => {
                    console.log("Error!");
                    console.log(error);


                }
            );


    }

    onSort = (column) => (e) => {
        console.log("clc");
        const direction = this.state.sort.column ? (this.state.sort.direction === 'asc' ? 'desc' : 'asc') : 'desc';
        const sortedData = this.state.bid_table_data.sort((a, b) => {
            if (column === 'Bid Price') {
                const nameA = a.bids.bid_price; // ignore upper and lowercase
                const nameB = b.bids.bid_price; // ignore upper and lowercase
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }

                // names must be equal
                return 0;
            } else {
                return a.contractValue - b.contractValue;
            }
        });

        if (direction === 'desc') {
            sortedData.reverse();
        }

        this.setState({
            bid_table_data: sortedData,
            sort: {
                column,
                direction,
            }
        });
    };


    handleSubmit(e) {
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



    handlePayMoney = (event) => {

        const {user} = this.props;

        event.preventDefault();
        console.log("Pay Freelancer");


var dif=this.state.sum-this.state.freelancer_fees;
        console.log("Sum:"+dif);
if(dif<0)
    window.alert("Insufficient Funds");
else {
    const Transaction = {
        from: user.username,
        to: this.state.project_details._id.freelancer_username,
        type: "Transfer",
        amount: this.state.freelancer_fees,
        project: this.state.project_details._id.id,
    };


    RESTService.postTransaction(Transaction)
        .then(
            response => {

                window.alert(response.data.message);
                history.push("/dashboard")

            },
            error => {

            }
        );
}
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
                                        <span>    {this.state.project_details.name}<br/>   <a
                                            href={`/ViewProfile/${this.state.project_details._id.emp_username}`}>@{this.state.project_details._id.emp_username}</a></span>
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
                                                    <a target="_blank"
                                                       href={`http://54.89.108.85:3001/project_files/${this.state.project_details._id.emp_username}/${data}`}>
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

                            {!this.state.status_Submitted && !this.state.status_Closed &&
                            <div className="panel panel-primary" id="shadowpanel">
                                <div className="BidDetailsTable">

                                    <table className="m-table">
                                        <thead>
                                        <tr>
                                            <th>Profile Image</th>
                                            <th>Freelancer Name</th>
                                            <th onClick={this.onSort('Bid Price')}>Bid Price</th>
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
                                                <td><img className="ProfileImageIcon"
                                                         src={`http://54.89.108.85:3001/ProfileImage/${data.bids.username}.jpg`}
                                                         onError={(e) => {
                                                             e.target.src = ProfileImage
                                                         }}/></td>
                                                <td><p className="mb-0">{data.bids.name}</p>
                                                    <a href={`/ViewProfile/${data.bids.username}`}> @{data.bids.username}</a>
                                                </td>
                                                <td>{data.bids.bid_price} USD</td>
                                                <td>{data.bids.days_req} days</td>
                                                <td>
                                                    {(data.bids.username === this.state.project_details._id.freelancer_username) &&
                                                    <span>Hired</span>
                                                    }
                                                    {!(data.bids.username === this.state.project_details._id.freelancer_username) &&
                                                    <button className="btn btn-primary" id="BidProjectButton"
                                                            value={data.bids.username}
                                                            onClick={this.handleSubmit.bind(this)}>Hire
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
                            }

                            {this.state.status_Submitted &&

                            <div className="panel panel-primary" id="shadowpanel">
                                <div style={{paddingLeft: 40}}>

                                <h4><b>Pay to:</b></h4>

                                <a href={`/ViewProfile/${this.state.project_details._id.freelancer_username}`}> @{this.state.project_details._id.freelancer_username}</a>


                                <h4><b>Freelancer Fees:</b></h4>

                                $ {this.state.freelancer_fees}


                                <h4><b>Your Balance:</b></h4>

                                $ {this.state.sum}


                                <h4><b>Files:</b></h4>


                                <span>{
                                    this.state.freelancer_files.map((data) =>
                                        <div key={data}>
                                            <a target="_blank"
                                               href={`http://54.89.108.85:3001/project_files/${this.state.project_details._id.emp_username}/${data}`}>
                                                {data}
                                            </a>
                                            <br/>
                                        </div>
                                    )


                                }</span>

                                    <button className="btn btn-primary" onClick={this.handlePayMoney.bind(this)} > Pay Freelancer </button>
                                    <button className="btn btn-primary" onClick={() => {
                                        history.push("/TransactionManager");
                                    }}
                                            style={{marginLeft: 40}}
                                    > Transaction Manager </button>
                                    <br/>    <br/>   <br/>

                                </div>
                            </div>

                            }


                            {this.state.status_Closed&&

                            <div className="panel panel-primary" id="shadowpanel">
                                <div style={{paddingLeft: 40}}>

                                    <h4><b>Freelancer Involved:</b></h4>

                                    <a href={`/ViewProfile/${this.state.project_details._id.freelancer_username}`}> @{this.state.project_details._id.freelancer_username}</a>


                                    <h4><b>Freelancer Fees Paid:</b></h4>

                                    $ {this.state.freelancer_fees}




                                    <h4><b>Files:</b></h4>


                                    <span>{
                                        this.state.freelancer_files.map((data) =>
                                            <div key={data}>
                                                <a target="_blank"
                                                   href={`http://54.89.108.85:3001/project_files/${this.state.project_details._id.emp_username}/${data}`}>
                                                    {data}
                                                </a>
                                                <br/>
                                            </div>
                                        )


                                    }</span>


                                    <br/>    <br/>   <br/>

                                </div>
                            </div>

                            }

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