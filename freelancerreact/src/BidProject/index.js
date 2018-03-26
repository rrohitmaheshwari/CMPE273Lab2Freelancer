import React from 'react';
import {connect} from 'react-redux';
import {history} from "../Helpers";
import ProfileImage from '../Images/ProfileImage.png';
import {RESTService} from "../API";

const queryString = require('query-string');


class BidProject extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            bid_button: false,
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
            Freelancer_Fees:'0',
            Total_Bid:'0',
            filenames:[]
        };
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(e) {

        const { name, value } = e.target;
        this.setState({ [name]: value });


        var bid= this.refs.bid_price.value;
        var day=this.refs.bid_date.value;
        console.log("bid:"+bid);

        console.log("day:"+day);


        if(bid!=='' && day!=='')
        {
            this.setState({ Project_Fee: (bid/day).toFixed(2) });
            this.setState({ Freelancer_Fees: (bid*0.1).toFixed(2) });
            this.setState({ Total_Bid: (bid*1.1).toFixed(2) });

        }
        else
        {

            this.setState({ Project_Fee: '0' });
            this.setState({ Freelancer_Fees: '0' });
            this.setState({ Total_Bid: '0' });

        }
    }
    componentWillMount() {
        var parsed = queryString.parse(this.props.location.search);

        console.log(parsed.project_id);
        var Project_ID = parsed.project_id;

        const {dispatch} = this.props;


        RESTService.getBidDetails(Project_ID)
            .then(
                response => {

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


    handleBidProject(e) {
        e.preventDefault();

        this.setState({
            bid_button: !this.state.bid_button,
        });

    }

    handleBid(e) {
        e.preventDefault();
        const {user} =this.props;

        if(!isNaN(this.state.bid_price) && !isNaN(this.state.bid_date) && this.state.bid_price!=='' && this.state.bid_date!=='') {
            var insert_Data = {
                user_id:user.user_id,
                project_id:this.state.project_details.project_id,
                bid_price:this.state.bid_price,
                days_req:this.state.bid_date,

            }
            console.log(insert_Data);


            RESTService.postBid(insert_Data)
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
        else
        {

           window.alert('Invalid Input!');

        }

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


                            {this.state.bid_button &&
                            <div className="panel panel-primary" id="shadowpanel">
                                <div className="BidDetails">


                                    <div className="col-sm-10 col-sm-offset-0">


                                        <span className="ProjectTitleSubheading">  Bid Proposal </span>
                                        <br/>
                                        <br/>

                                        <div className="col-sm-12 col-sm-offset-0">
                                            <div className="col-md-4 col-md-offset-0">
                                                <b>Bid Price</b>
                                                <br/>


                                                <span className="input-group">
                                            <span className="add-on">$</span>
                                            <input className="BidProposal-form-input" ref="bid_price" name="bid_price" type="text" placeholder="0"  onChange={this.handleChange}/>
                                            <span className="add-on">USD</span>
                                        </span>
                                                <br/>
                                            </div>

                                            <div className="col-md-4 col-md-offset-0">
                                                <b>Bid Days</b>

                                                <br/>


                                                <span className="input-group">
                                            <span className="add-on"> </span>
                                            <input className="BidProposal-form-input" ref="bid_date" name="bid_date" type="text"  placeholder="0"  onChange={this.handleChange}/>
                                            <span className="add-on">Days</span>
                                        </span>
                                                <br/>
                                            </div>
                                        </div>

                                        <br/>


                                        <br/>
                                        <br/>

                                        <div className="col-sm-7 col-sm-offset-0">
                                            <div className="col-md-5 col-md-offset-0">
                                                <span><em>Project Fee   </em></span>
                                            </div>
                                            <div className="col-md-7 col-md-offset-0">
                                                <b>${this.state.Project_Fee} USD / Day</b>
                                            </div>
                                        </div>


                                        <br/>
                                        <div className="col-sm-7 col-sm-offset-0">


                                            <div className="col-md-5 col-md-offset-0">
                                                <span><em>Free Lancer fee   </em></span>
                                            </div>
                                            <div className="col-md-7 col-md-offset-0">
                                                <b>${this.state.Freelancer_Fees} USD</b>
                                            </div>

                                        </div>

                                        <br/>
                                        <div className="col-sm-7 col-sm-offset-0">


                                            <div className="col-md-5 col-md-offset-0">
                                                <span><em>Your Total Bid    </em></span>
                                            </div>
                                            <div className="col-md-7 col-md-offset-0">
                                                <b>${this.state.Total_Bid} USD</b>
                                            </div>
                                        </div>


                                        <br/>
                                        <br/>
                                        <br/>

                                        <div className="col-sm-8 col-sm-offset-0" id="borderlighttop">
                                            <div className="col-md-6 col-md-offset-7">
                                                <button className="btn btn-primary"
                                                        id="BidProjectButtonProjectDetails"
                                                        onClick={this.handleBid.bind(this)}>Place Bid</button>
                                                <a onClick={this.handleBidProject.bind(this)}>Cancel</a>
                                                <br/>
                                            </div>
                                        </div>


                                    </div>


                                </div>
                            </div>
                            }


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
                                        <span>{this.state.project_details.name}<br/><a href={`/ViewProfilePage/${this.state.project_details.emp_username}`}>@{this.state.project_details.emp_username}</a></span>
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

                                        <button className="btn btn-primary" id="BidProjectButtonBig"
                                                onClick={this.handleBidProject.bind(this)}>Bid On This Project
                                        </button>
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
                                        </tr>
                                        </thead>
                                        <tbody>


                                        {
                                            !this.state.showtable &&
                                            <tr>
                                                <td>Be the first one to bid!</td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                            </tr>
                                        }
                                        {this.state.showtable &&
                                        this.state.bid_table_data.map((data) =>
                                            <tr key={data.id} className="bidtablerow">
                                                <td> <img className="ProfileImageIcon" src={`http://localhost:3001/ProfileImage/${data.username}.jpg`} onError={(e)=>{e.target.src=ProfileImage}}/></td>
                                                <td><p>{data.name}</p>
                                                    <a href={`/ViewProfilePage/${data.username}`}>@{data.username}</a></td>
                                                <td>{data.bid_price} USD</td>
                                                <td>{data.days_req} days</td>
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

const connectedBidProject = connect(mapStateToProps)(BidProject);
export {connectedBidProject as BidProject};