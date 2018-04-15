import React from 'react';
import {connect} from 'react-redux';
import Icon from '../Images/Freelancer Icon Short.png';
import {history} from "../Helpers";
import {RESTService} from "../API";

class DashboardPage extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            currentPageNumber_table1: 1,
            currentPageNumber_table2: 1,
            currentPageNumber_table3: 1,
            itemsPerPage: 5,
            my_project_details: [],
            my_project_details_status: false,
            my_bid_details: [],
            my_bid_status: false,
            my_project_as_freelancer: [],
            my_project_as_freelancer_status: false,
            my_project_details_master: [],
            my_bid_details_master: [],
            my_project_as_freelancer_master: [],
            value_tab1: "All",
            value_tab2: "All",
            value_tab3: "All",
        }
    };

    componentWillMount() {
        const {dispatch} = this.props;
        dispatch({type: "DASHBOARD"});
        const {user} = this.props;

        RESTService.getMyProjectDetails(user.username)
            .then(
                response => {
                    if (response.result.length > 0)
                        this.setState({my_project_details_status: true});
                    this.setState({my_project_details: response.result});
                    this.setState({my_project_details_master: response.result});

                    console.log("this.state.my_project_details");
                    console.log(this.state.my_project_details);
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

        RESTService.getMyBidDetails()
            .then(
                response => {
                    // this.setState({my_project_as_freelancer: response.result});
                    var temp_array = [];
                    var j = 0;
                    for (let i = 0; i < response.result.length; i++) {
                        if (response.result[i].status !== "Submitted" && response.result[i].freelancer_username !== user.username) {
                            temp_array[j] = response.result[i];
                            console.log(response.result[i].status);
                            j++;
                        }
                    }

                    if (temp_array.length > 0)
                        this.setState({my_bid_status: true});


                    this.setState({my_bid_details: temp_array});
                    this.setState({my_bid_details_master: temp_array});


                    // this.setState({my_project_as_freelancer: response.result});
                    temp_array = [];
                   j = 0;
                    for (let i = 0; i < response.result.length; i++) {
                        if (response.result[i].freelancer_username === user.username) {
                            temp_array[j] = response.result[i];
                            console.log(response.result[i].status);
                            j++;
                        }
                    }

                    if (temp_array.length > 0)
                        this.setState({my_project_as_freelancer_status: true});

                    this.setState({my_project_as_freelancer: temp_array});
                    this.setState({my_project_as_freelancer_master: temp_array});

                    console.log("this.state.my_project_as_freelancer");
                    console.log(this.state.my_project_as_freelancer);


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

    handleSubmitPost(push_page, e) {
        e.preventDefault();
        console.log(e.target.value);
        var project_id = e.target.value;
        const {dispatch} = this.props;
        dispatch({type: "UNSET"});
        history.push(push_page + "?project_id=" + project_id);
    }

    handleSubmit(push_page, dispatch_setter, e) {
        e.preventDefault();
        const {dispatch} = this.props;
        dispatch({type: dispatch_setter});
        history.push(push_page);
    }


    handleInputChange_tableMyProjects(e) {
        e.preventDefault();
        this.setState({value_tab1: "All"});
        console.log(e.target.value);

        var temp_array = [];

        var j = 0;
        for (var i = 0; i < this.state.my_project_details_master.length; i++) {
            if (this.state.my_project_details_master[i]._id.title.includes(e.target.value)) {
                temp_array[j] = this.state.my_project_details_master[i]
                j++;
            }
        }
        this.setState({my_project_details: temp_array});
    }


    handleInputChange_tablebid(e) {
        e.preventDefault();
        this.setState({value_tab2: "All"});
        console.log(e.target.value);

        var temp_array = [];

        var j = 0;
        for (var i = 0; i < this.state.my_bid_details_master.length; i++) {
            if (this.state.my_bid_details_master[i].title.includes(e.target.value)) {
                temp_array[j] = this.state.my_bid_details_master[i]
                j++;
            }
        }
        this.setState({my_bid_details: temp_array});


    }

    handleInputChange_tablefreelancer(e) {
        e.preventDefault();
        this.setState({value_tab3: "All"});
        console.log(e.target.value);

        var temp_array = [];

        var j = 0;
        for (var i = 0; i < this.state.my_project_as_freelancer_master.length; i++) {
            if (this.state.my_project_as_freelancer_master[i].title.includes(e.target.value)) {
                temp_array[j] = this.state.my_project_as_freelancer_master[i]
                j++;
            }
        }
        this.setState({my_project_as_freelancer: temp_array});
    }


    handleChange_select1(event) {
        event.preventDefault();
        document.getElementById('Search1').value = "";

        this.setState({value_tab1: event.target.value});
        if (event.target.value === "All") {
            this.setState({my_project_details: this.state.my_project_details_master});


        }
        else if (event.target.value === "Open") {
            var temp_array = [];


            var j = 0;
            for (var i = 0; i < this.state.my_project_details_master.length; i++) {
                if (this.state.my_project_details_master[i]._id.status === "Open") {
                    temp_array[j] = this.state.my_project_details_master[i]
                    j++;
                }
            }
            this.setState({my_project_details: temp_array});

        }
        else if (event.target.value === "Assigned") {
            var temp_array = [];


            var j = 0;
            for (var i = 0; i < this.state.my_project_details_master.length; i++) {
                if (this.state.my_project_details_master[i]._id.status === "Assigned") {
                    temp_array[j] = this.state.my_project_details_master[i]
                    j++;
                }
            }
            this.setState({my_project_details: temp_array});

        }
        else if (event.target.value === "Submitted") {
            var temp_array = [];


            var j = 0;
            for (var i = 0; i < this.state.my_project_details_master.length; i++) {
                if (this.state.my_project_details_master[i]._id.status === "Submitted") {
                    temp_array[j] = this.state.my_project_details_master[i]
                    j++;
                }
            }
            this.setState({my_project_details: temp_array});

        }
        else if (event.target.value === "Closed") {
            var temp_array = [];


            var j = 0;
            for (var i = 0; i < this.state.my_project_details_master.length; i++) {
                if (this.state.my_project_details_master[i]._id.status === "Closed") {
                    temp_array[j] = this.state.my_project_details_master[i]
                    j++;
                }
            }
            this.setState({my_project_details: temp_array});

        }

    }


    handleChange_select2(event) {
        event.preventDefault();
        document.getElementById('Search2').value = "";

        this.setState({value_tab2: event.target.value});
        if (event.target.value === "All") {
            this.setState({my_bid_details: this.state.my_bid_details_master});


        }
        else if (event.target.value === "Open") {
            var temp_array = [];


            var j = 0;
            for (var i = 0; i < this.state.my_bid_details_master.length; i++) {
                if (this.state.my_bid_details_master[i].status === "Open") {
                    temp_array[j] = this.state.my_bid_details_master[i]
                    j++;
                }
            }
            this.setState({my_bid_details: temp_array});

        }
        else if (event.target.value === "Assigned") {
            var temp_array = [];


            var j = 0;
            for (var i = 0; i < this.state.my_bid_details_master.length; i++) {
                if (this.state.my_bid_details_master[i].status === "Assigned") {
                    temp_array[j] = this.state.my_bid_details_master[i]
                    j++;
                }
            }
            this.setState({my_bid_details: temp_array});

        }
        else if (event.target.value === "Submitted") {
            var temp_array = [];

            var j = 0;
            for (var i = 0; i < this.state.my_bid_details_master.length; i++) {
                if (this.state.my_bid_details_master[i].status === "Submitted") {
                    temp_array[j] = this.state.my_bid_details_master[i]
                    j++;
                }
            }
            this.setState({my_bid_details: temp_array});
        }
    }


    handleChange_select3(event) {
        event.preventDefault();
        document.getElementById('Search3').value = "";

        this.setState({value_tab3: event.target.value});
        if (event.target.value === "All") {
            this.setState({my_project_as_freelancer: this.state.my_project_as_freelancer_master});


        }

        else if (event.target.value === "Assigned") {
            var temp_array = [];


            var j = 0;
            for (var i = 0; i < this.state.my_project_as_freelancer_master.length; i++) {
                if (this.state.my_project_as_freelancer_master[i].status === "Assigned") {
                    temp_array[j] = this.state.my_project_as_freelancer_master[i]
                    j++;
                }
            }
            this.setState({my_project_as_freelancer: temp_array});

        }
        else if (event.target.value === "Submitted") {
            var temp_array = [];


            var j = 0;
            for (var i = 0; i < this.state.my_project_as_freelancer_master.length; i++) {
                if (this.state.my_project_as_freelancer_master[i].status === "Submitted") {
                    temp_array[j] = this.state.my_project_as_freelancer_master[i]
                    j++;
                }
            }
            this.setState({my_project_as_freelancer: temp_array});

        }

    }

    handleChangePage_table1 = (number) => {
        // e.preventDefault();
        console.log('####handleChangePage_table1.event.target:');
        // console.log(event.target.value);
        console.log(number);
        this.setState({
            currentPageNumber_table1: Number(number)
        });
    };


    handleChangePage_table2 = (number) => {
        // e.preventDefault();
        console.log('####handleChangePage_table1.event.target:');
        // console.log(event.target.value);
        console.log(number);
        this.setState({
            currentPageNumber_table2: Number(number)
        });
    };


    handleChangePage_table3 = (number) => {
        // e.preventDefault();
        console.log('####handleChangePage_table1.event.target:');
        // console.log(event.target.value);
        console.log(number);
        this.setState({
            currentPageNumber_table3: Number(number)
        });
    };
    render() {

        let currentItems_table1;
        const pageNumbers_table1 = [];

        const {user} = this.props;

        if (this.state.my_project_details && (this.state.my_project_details.length > 0)) {

            //Pagination logic
            const {currentPageNumber_table1, itemsPerPage} = this.state;
            // Logic for displaying current items
            const indexOfLastItem = currentPageNumber_table1 * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            currentItems_table1 = this.state.my_project_details.slice(indexOfFirstItem, indexOfLastItem);


            // Logic for displaying page numbers
            for (let i = 1; i <= Math.ceil(this.state.my_project_details.length / itemsPerPage); i++) {
                pageNumbers_table1.push(i);
            }
        }

        const renderPageNumbers_table1 = pageNumbers_table1.map(number => {
            return (

                <li key={number} id={number} className={
                    (this.state.currentPageNumber_table1 === number) ? 'active' : ''
                }>
                    <a onClick={() => this.handleChangePage_table1(number)}> {number} </a>
                </li>
            );
        });


        let currentItems_table2;
        const pageNumbers_table2 = [];


        if (this.state.my_bid_details && (this.state.my_bid_details.length > 0)) {

            //Pagination logic
            const {currentPageNumber_table2, itemsPerPage} = this.state;
            // Logic for displaying current items
            const indexOfLastItem = currentPageNumber_table2 * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            currentItems_table2 = this.state.my_bid_details.slice(indexOfFirstItem, indexOfLastItem);




            // Logic for displaying page numbers
            for (let i = 1; i <= Math.ceil(this.state.my_bid_details.length / itemsPerPage); i++) {
                pageNumbers_table2.push(i);
            }
        }

        const renderPageNumbers_table2 = pageNumbers_table2.map(number => {
            return (

                <li key={number} id={number} className={
                    (this.state.currentPageNumber_table2 === number) ? 'active' : ''
                }>
                    <a onClick={() => this.handleChangePage_table2(number)}> {number} </a>
                </li>
            );
        });

        let currentItems_table3;
        const pageNumbers_table3 = [];


        if (this.state.my_project_as_freelancer && (this.state.my_project_as_freelancer.length > 0)) {

            //Pagination logic
            const {currentPageNumber_table3, itemsPerPage} = this.state;
            // Logic for displaying current items
            const indexOfLastItem = currentPageNumber_table3 * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            currentItems_table3 = this.state.my_project_as_freelancer.slice(indexOfFirstItem, indexOfLastItem);




            // Logic for displaying page numbers
            for (let i = 1; i <= Math.ceil(this.state.my_project_as_freelancer.length / itemsPerPage); i++) {
                pageNumbers_table3.push(i);
            }
        }

        const renderPageNumbers_table3 = pageNumbers_table3.map(number => {
            return (

                <li key={number} id={number} className={
                    (this.state.currentPageNumber_table3 === number) ? 'active' : ''
                }>
                    <a onClick={() => this.handleChangePage_table3(number)}> {number} </a>
                </li>
            );
        });





        return (
            <div>


                <div className="jumbotron">
                    <div className="col-sm-8 col-sm-offset-2">
                        <div className="col-md-8 col-md-offset-0">
                            <span className="ProjectTitleBid"> My Projects</span>
                        </div>
                        {this.state.my_project_details_status &&
                        <div>
                            <div className="col-md-2 col-md-offset-0">
                                <div class="custom-select">
                                    <select value={this.state.value_tab1}
                                            onChange={this.handleChange_select1.bind(this)}>
                                        <option value="All">All</option>
                                        <option value="Open">Open</option>
                                        <option value="Assigned">Assigned</option>
                                        <option value="Submitted">Submitted</option>
                                        <option value="Closed">Closed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-2 col-md-offset-0">

                                <input
                                    placeholder="Search..."
                                    ref={input => this.search = input}
                                    className={'searchbar'}
                                    onChange={this.handleInputChange_tableMyProjects.bind(this)}
                                    id={'Search1'}
                                />

                            </div>
                        </div>
                        }
                    </div>

                    <div className="col-sm-8 col-sm-offset-2">
                        <div className="col-md-12 col-md-offset-0">


                            <div className="panel panel-primary" id="shadowpanel">
                                <div className="BidDetailsTable">


                                    {!this.state.my_project_details_status &&
                                    <div className="noProject">
                                        <div className="col-sm-8 col-sm-offset-0">
                                            <div className="col-md-12 col-md-offset-0">
                                                <span
                                                    className="labelnoproject"> You haven't posted any project yet!</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-2 col-sm-offset-1">
                                            <div className="col-md-12 col-md-offset-0">
                                                <button className="btn btn-primary" id="PostProjectButton"
                                                        onClick={this.handleSubmit.bind(this, "/PostProject", "POST_A_PROJECT")}>
                                                    Post a Project
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    }


                                    {this.state.my_project_details_status &&

                                    <table className="m-table">
                                        <thead>
                                        <tr>


                                            <th className="Paddingleft100">Project Title</th>
                                            <th>Average Bid</th>
                                            <th>Complete by</th>
                                            <th>Status</th>
                                            <th>Freelancer</th>
                                        </tr>
                                        </thead>
                                        <tbody>


                                        {currentItems_table1 && currentItems_table1.map((data) =>
                                            <tr key={data._id.id}>
                                                <td><img className="FreeLancerIconDashboard" src={Icon}
                                                         alt="FreelancerIcon"/>
                                                    <a href={`/HireProject?project_id=${data._id.id}`}>{data._id.title}</a>
                                                </td>
                                                <td>{Number(data.avg_bid).toFixed(2)}</td>
                                                <td>{data._id.complete_by}</td>
                                                <td>{data._id.status}</td>
                                                <td>{
                                                    data._id.freelancer_username &&
                                                    <a href={`/ViewProfilePage/${data._id.freelancer_username}`}>@{data._id.freelancer_username}</a>
                                                }
                                                    {!data._id.freelancer_username &&
                                                    <button className="btn btn-primary" id="BidProjectButton"
                                                            value={data._id.id}
                                                            onClick={this.handleSubmitPost.bind(this, "/HireProject")}>
                                                        Hire
                                                    </button>
                                                    }</td>
                                            </tr>
                                        )
                                        }

                                        </tbody>
                                    </table>
                                    }


                                </div>
                            </div>

                            <div className="pagination">
                                <ul id="page-numbers" className="pagination">
                                    {renderPageNumbers_table1}
                                </ul>
                            </div>

                        </div>
                    </div>

                    <div className="col-sm-8 col-sm-offset-2">
                        <div className="col-md-8 col-md-offset-0">
                            <span className="ProjectTitleBid"> Projects I have bid on</span>
                        </div>
                        {this.state.my_bid_status &&
                        <div>
                            <div className="col-md-2 col-md-offset-0">
                                <div class="custom-select">
                                    <select value={this.state.value_tab2}
                                            onChange={this.handleChange_select2.bind(this)}>
                                        <option value="All">All</option>
                                        <option value="Open">Open</option>
                                        <option value="Assigned">Assigned</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-2 col-md-offset-0">

                                <input
                                    placeholder="Search..."
                                    ref={input => this.search = input}
                                    className={'searchbar'}
                                    onChange={this.handleInputChange_tablebid.bind(this)}
                                    id={'Search2'}
                                />

                            </div>
                        </div>
                        }
                    </div>

                    <div className="col-sm-8 col-sm-offset-2">
                        <div className="col-md-12 col-md-offset-0">

                            <div className="panel panel-primary" id="shadowpanel">
                                <div className="BidDetailsTable">


                                    {!this.state.my_bid_status &&
                                    <div className="noProject">
                                        <div className="col-sm-8 col-sm-offset-0">
                                            <div className="col-md-12 col-md-offset-0">
                                                <span
                                                    className="labelnoproject"> You haven't bid on any project yet!</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-2 col-sm-offset-1">
                                            <div className="col-md-12 col-md-offset-0">
                                                <button className="btn btn-primary" id="BidProjectButton"
                                                        onClick={this.handleSubmit.bind(this, "/HomePage", "HOME")}>
                                                    Bid now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    }


                                    {this.state.my_bid_status &&

                                    <table className="m-table">
                                        <thead>
                                        <tr>
                                            <th className="Paddingleft100">Project Title</th>
                                            <th>Employer</th>
                                            <th>Avg Bid</th>
                                            <th>Your Bid</th>
                                            <th>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>


                                        {currentItems_table2 && currentItems_table2.map((data) =>
                                            <tr key={data._id}>
                                                <td><img className="FreeLancerIconDashboard" src={Icon}
                                                         alt="FreelancerIcon"/>
                                                    <a href={`/BidProject?project_id=${data._id}`}>{data.title}</a></td>
                                                <td><a
                                                    href={`/ViewProfilePage/${data.emp_username}`}>@{data.emp_username}</a>
                                                </td>
                                                <td>{Number(data.avg_bid).toFixed(2)}</td>
                                                <td>{data.bids.bid_price}</td>
                                                <td>{data.status}</td>
                                            </tr>
                                        )
                                        }

                                        </tbody>
                                    </table>
                                    }


                                </div>
                            </div>
                            <div className="pagination">
                                <ul id="page-numbers" className="pagination">
                                    {renderPageNumbers_table2}
                                </ul>
                            </div>

                        </div>
                    </div>


                    <div className="col-sm-8 col-sm-offset-2">
                        <div className="col-md-8 col-md-offset-0">
                            <span className="ProjectTitleBid"> Projects I am working on as Freelancer</span>
                        </div>
                        {this.state.my_project_as_freelancer_status &&
                        <div>
                            <div className="col-md-2 col-md-offset-0">
                                <div class="custom-select">
                                    <select value={this.state.value_tab3}
                                            onChange={this.handleChange_select3.bind(this)}>
                                        <option value="All">All</option>
                                        <option value="Assigned">Assigned</option>
                                        <option value="Submitted">Submitted</option>
                                    </select>
                                </div>
                            </div>

                            <div className="col-md-2 col-md-offset-0">

                                <input
                                    placeholder="Search..."
                                    ref={input => this.search = input}
                                    className={'searchbar'}
                                    onChange={this.handleInputChange_tablefreelancer.bind(this)}
                                    id={'Search3'}
                                />
                            </div>
                        </div>
                        }
                    </div>

                    <div className="col-sm-8 col-sm-offset-2">
                        <div className="col-md-12 col-md-offset-0">

                            <div className="panel panel-primary" id="shadowpanel">
                                <div className="BidDetailsTable">


                                    {!this.state.my_project_as_freelancer_status &&
                                    <div className="noProject">
                                        <div className="col-sm-8 col-sm-offset-0">
                                            <div className="col-md-12 col-md-offset-0">
                                                <span
                                                    className="labelnoproject"> You are not assigned to any project!</span>
                                            </div>
                                        </div>
                                        <div className="col-sm-2 col-sm-offset-1">
                                            <div className="col-md-12 col-md-offset-0">
                                                <button className="btn btn-primary" id="BidProjectButton"
                                                        onClick={this.handleSubmit.bind(this, "/HomePage", "HOME")}>
                                                    Bid now
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    }


                                    {this.state.my_project_as_freelancer_status &&

                                    <table className="m-table">
                                        <thead>
                                        <tr>
                                            <th className="Paddingleft100">Project Title</th>
                                            <th>Employer</th>
                                            <th>Avg Bid</th>
                                            <th>Your Bid</th>
                                            <th>Status</th>
                                        </tr>
                                        </thead>
                                        <tbody>


                                        {currentItems_table3 && currentItems_table3.map((data) =>
                                            <tr key={data._id}>
                                                <td><img className="FreeLancerIconDashboard" src={Icon}
                                                         alt="FreelancerIcon"/>
                                                    <a href={`/BidProject?project_id=${data._id}`}>{data.title}</a></td>
                                                <td><a
                                                    href={`/ViewProfilePage/${data.emp_username}`}>@{data.emp_username}</a>
                                                </td>
                                                <td>{Number(data.avg_bid).toFixed(2)}</td>
                                                <td>{data.bids.bid_price}</td>
                                                <td>{data.status}</td>
                                            </tr>
                                        )
                                        }
                                        </tbody>
                                    </table>
                                    }


                                </div>
                            </div>
                            <div className="pagination">
                                <ul id="page-numbers" className="pagination">
                                    {renderPageNumbers_table3}
                                </ul>
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
        user
    };
}

const connectedDashboardPage = connect(mapStateToProps)(DashboardPage);
export {connectedDashboardPage as DashboardPage};