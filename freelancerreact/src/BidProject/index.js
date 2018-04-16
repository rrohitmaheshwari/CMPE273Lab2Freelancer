import React from 'react';
import {connect} from 'react-redux';
import {history} from "../Helpers";
import ProfileImage from '../Images/ProfileImage.png';
import {RESTService} from "../API";
import filesize from "filesize";
import Dropzone from 'react-dropzone';


import plusIcon from '../Images/plus_icon.png';
import uploadIcon from '../Images/upload_file.png';
import {userActions} from "../Actions";
import Alert from "react-s-alert";


const queryString = require('query-string');


class BidProject extends React.Component {
    constructor(props) {

        super(props);
        this.state = {
            bid_button: false,
            project_details: {

                "_id": {
                    "project_id": '',
                    "emp_username": '',
                    "title": '',
                    "description": '',
                    "budget_range": '',
                    "skills_req": '',
                    "complete_by": '',
                    "filenames": '',
                    "name": ''
                }
            },
            bid_table_data: {},
            bid_header: {
                "_id": {
                    "bid_count": '',
                    "avg_bid": ''
                }
            },
            showtable: false,
            bid_price: '0',
            bid_date: '0',
            Project_Fee: '0',
            Freelancer_Fees: '0',
            Total_Bid: '0',
            filenames: [],
            sort: {
                column: null,
                direction: 'desc',
            },
            freelancer_assigned: false,
            isUploaded: false,
            projectFiles: [],
            project_closed:false,
        };
        this.handleChange = this.handleChange.bind(this);
    };

    handleChange(e) {

        const {name, value} = e.target;
        this.setState({[name]: value});


        var bid = this.refs.bid_price.value;
        var day = this.refs.bid_date.value;
        console.log("bid:" + bid);

        console.log("day:" + day);


        if (bid !== '' && day !== '') {
            this.setState({Project_Fee: (bid / day).toFixed(2)});
            this.setState({Freelancer_Fees: (bid * 0.1).toFixed(2)});
            this.setState({Total_Bid: (bid * 1.1).toFixed(2)});

        }
        else {

            this.setState({Project_Fee: '0'});
            this.setState({Freelancer_Fees: '0'});
            this.setState({Total_Bid: '0'});

        }
    }

    componentWillMount() {
        var parsed = queryString.parse(this.props.location.search);

        console.log(parsed.project_id);
        var Project_ID = parsed.project_id;

        const {dispatch, user} = this.props;


        dispatch({type: "BID_NOW"});


        RESTService.getBidDetails(Project_ID)
            .then(
                response => {

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
                    if (this.state.project_details._id.filenames && this.state.project_details._id.filenames.indexOf(",") > 0)
                        this.setState({"filenames": this.state.project_details._id.filenames.split(",")});
                    else
                        this.setState({"filenames": []});
                    console.log("this.state");
                    console.log(this.state);
                    console.log(this.state.filenames);
                    console.log(this.state.project_details);
                    if (this.state.project_details._id.freelancer_username === user.username) {
                        this.setState({freelancer_assigned: true});
                    }
                    if (this.state.project_details._id.status === "Closed") {
                        this.setState({project_closed: true});
                    }

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

    onDrop = (acceptedFiles, rejectedFiles) => {

        var projectFiles = this.state.projectFiles;
        projectFiles.push(acceptedFiles);
        this.setState({
            projectFiles: projectFiles,
            isUploaded: true
        });
    }

    handleDeleteFile = (event) => {

        event.preventDefault();

        var fileName = event.target.value;
        var oldProjectFiles = this.state.projectFiles;
        var newProjectFiles = [];
        for (let position = 0; position < oldProjectFiles.length; position++) {
            if (oldProjectFiles[position][0].name === fileName) {
                newProjectFiles = oldProjectFiles.splice(position, 1);
            }
        }

        this.setState({isSubmitted: false});

        if (!newProjectFiles) {
            this.setState({
                projectFiles: newProjectFiles
            });
        }
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


    handleBidProject(e) {
        e.preventDefault();

        this.setState({
            bid_button: !this.state.bid_button,
        });

    }

    handleBid(e) {
        e.preventDefault();
        const {user} = this.props;

        if (!isNaN(this.state.bid_price) && !isNaN(this.state.bid_date) && this.state.bid_price !== '' && this.state.bid_date !== '') {
            var insert_Data = {
                name: user.name,
                project_id: this.state.project_details._id.id,
                bid_price: this.state.bid_price,
                days_req: this.state.bid_date
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
        } else {
            window.alert('Invalid Input!');
        }
    }


    handleSubmit = (event) => {

        event.preventDefault();

        this.setState({isSubmitted: true});

        let file = this.state.projectFiles;

        let filenames = "";
        if (file.length > 0) {
            filenames = this.uploadFiles(file);
        }

        const project = {
            id: this.state.project_details._id.id,
            filenames: filenames,
        };


        RESTService.submitProject(project)
            .then(
                response => {
                    console.log(response.data.message);


                    window.alert(response.data.message);
                    history.push("/dashboard")
                },
                error => {
                    //  dispatch(alertActions.projectPostError(error.data.message));
                }
            );


    }

    uploadFiles = (files) => {
        const uploadFiles = new FormData();
        var filenames = "";
        for (let index = 0; index < files.length; index++) {
            if (index === files.length - 1) {
                filenames = filenames.concat(files[index][0].name);
            }
            else {
                filenames = filenames.concat(files[index][0].name + ",");
            }
            uploadFiles.append("file", files[index][0]);
        }

        RESTService.uploadFile(uploadFiles)
            .then(
                response => {
                    console.log(response.data.message);

                },
                error => {
                    console.log(error);
                }
            )


        return filenames;
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
                                        className="ProjectHeaderValue">{this.state.project_details._id.bid_count}</span>

                                    </div>
                                    <div className="col-sm-2 col-sm-offset-0" id="ProjectDetailBox">


                                        <span>Avg Bid</span>
                                        <br/><span
                                        className="ProjectHeaderValue">{Number(this.state.project_details.avg_bid).toFixed(2)}$</span>
                                    </div>
                                    <div className="col-sm-2 col-sm-offset-0" id="ProjectDetailBox">


                                        <span>Project Budget </span>
                                        <br/><span
                                        className="ProjectHeaderValue">{this.state.project_details._id.budget_range}</span>
                                    </div>
                                    <div className="col-sm-5 col-sm-offset-0" id="ProjectDetailBoxEnd">
                                        <span>Expected</span>
                                        <br/><span
                                        className="ProjectHeaderValue">{this.state.project_details._id.complete_by}</span>

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
                                            <input className="BidProposal-form-input" ref="bid_price" name="bid_price"
                                                   type="text" placeholder="0" onChange={this.handleChange}/>
                                            <span className="add-on">USD</span>
                                        </span>
                                                <br/>
                                            </div>

                                            <div className="col-md-4 col-md-offset-0">
                                                <b>Bid Days</b>

                                                <br/>


                                                <span className="input-group">
                                            <span className="add-on"> </span>
                                            <input className="BidProposal-form-input" ref="bid_date" name="bid_date"
                                                   type="text" placeholder="0" onChange={this.handleChange}/>
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
                                                        onClick={this.handleBid.bind(this)}>Place Bid
                                                </button>
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
                                        <span>{this.state.project_details._id.description}</span>
                                        <br/>
                                        <br/>
                                        <span className="ProjectTitleSubheading"> Employer</span>
                                        <br/>
                                        <span>{this.state.project_details.name}<br/><a
                                            href={`/ViewProfilePage/${this.state.project_details._id.emp_username}`}>@{this.state.project_details._id.emp_username}</a></span>
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
                                        {!this.state.freelancer_assigned &&
                                        <button className="btn btn-primary" id="BidProjectButtonBig"
                                                onClick={this.handleBidProject.bind(this)}>Bid On This Project
                                        </button>
                                        }
                                        <br/> <br/> <br/> <br/> <br/> <br/> <br/> <br/><br/> <br/> <br/> <br/> <br/>
                                        <br/> <br/>
                                        <span><b>Project Id:</b></span>{this.state.project_details._id.id}
                                    </div>

                                </div>
                            </div>

                            {!this.state.freelancer_assigned &&
                            <div className="panel panel-primary" id="shadowpanel">
                                <div className="BidDetailsTable">

                                    <table className="m-table">
                                        <thead>
                                        <tr>
                                            <th>Profile Image</th>
                                            <th>Freelancer Name</th>
                                            <th onClick={this.onSort('Bid Price')}>Bid Price
                                                {
                                                    this.state.sort.column &&
                                                    this.state.sort.direction === 'desc' &&
                                                    <i class="ml-1 fa fa-sort-desc"></i>
                                                }
                                                {
                                                    this.state.sort.column &&
                                                    this.state.sort.direction === 'asc' &&
                                                    <i class="ml-1 fa fa-sort-asc"></i>
                                                }
                                                </th>
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
                                            <tr key={data._id + data.bids.username} className="bidtablerow">
                                                <td><img className="ProfileImageIcon"
                                                         src={`http://54.89.108.85:3001/ProfileImage/${data.bids.username}.jpg`}
                                                         alt={``} onError={(e) => {
                                                    e.target.src = ProfileImage
                                                }}/></td>
                                                <td><p>{data.bids.name}</p>
                                                    <a href={`/ViewProfilePage/${data.bids.username}`}>@{data.bids.username}</a>
                                                </td>
                                                <td>{data.bids.bid_price} USD</td>
                                                <td>{data.bids.days_req} days</td>
                                            </tr>
                                        )
                                        }


                                        </tbody>
                                    </table>

                                </div>
                            </div>
                            }

                            {this.state.freelancer_assigned && !this.state.project_closed &&


                            <div className="panel panel-primary" id="shadowpanel">


                                <Dropzone
                                    className="file-upload-area"
                                    onDrop={(files) => this.onDrop(files)}
                                >
                                                            <span className="btn btn-plain btn-file-uploader">
                                                                <span><img className="fl-icon-plus" src={plusIcon}
                                                                           alt=""/></span>
                                                                <span
                                                                    className="file-upload-button-text">Upload File</span>
                                                            </span>
                                    <p className="file-upload-text">
                                        Drag & drop any images or documents.
                                    </p>
                                </Dropzone>
                                {
                                    this.state.isUploaded &&
                                    <table className="table-upload">
                                        <tbody className="table-upload-body">
                                        {
                                            this.state.projectFiles.map((data) =>
                                                <tr key={this.state.projectFiles.indexOf(data)}
                                                    className="table-upload-row">
                                                    <td className="table-upload-row-preview">
                                                        <img
                                                            className="preview-image"
                                                            src={data[0].type === 'application/pdf' ? uploadIcon : URL.createObjectURL(data[0])}
                                                            alt="">

                                                        </img>
                                                    </td>
                                                    <td className="table-upload-row-name">
                                                                                <span>
                                                                                    {data[0].name}
                                                                                </span>
                                                    </td>
                                                    <td className="table-upload-row-size">
                                                        {filesize(data[0].size)}
                                                    </td>
                                                    <td className="table-upload-row-delete">
                                                        <button
                                                            value={data[0].name}
                                                            className="btn btn-danger btn-small"
                                                            onClick={this.handleDeleteFile}
                                                        >
                                                            <span>Delete</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </table>
                                }


                                <div>
                                    <button className="btn btn-xlarge pp-submit-btn btn-primary"
                                            onClick={this.handleSubmit.bind(this)}>
                                        <span>Submit</span>
                                    </button>

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

const connectedBidProject = connect(mapStateToProps)(BidProject);
export {connectedBidProject as BidProject};