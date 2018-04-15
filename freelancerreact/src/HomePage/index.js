import React from 'react';
import {connect} from 'react-redux';
import Banner from '../Images/Banner.png';
import Icon from '../Images/Freelancer Icon Short.png';
import ProfileImage from '../Images/ProfileImage.png';
import {history} from "../Helpers";
import {userActions} from "../Actions";
import {RESTService} from "../API";


class HomePage extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            currentPageNumber_table1: 1,
            currentPageNumber_table2: 1,
            itemsPerPage: 5,
            homecontent: false,
            homecontentmaster: false,
            relevantcontent: false,
            relevantcontentmaster: false,

        };

    }

    handleSubmit(push_page, e) {
        e.preventDefault();

        console.log(e.target.value);
        var project_id = e.target.value;
        const {dispatch} = this.props;
        dispatch({type: "UNSET"});
        // dispatch({type: "SET_PROJECT_DETAILS",project_id});
        history.push(push_page + "?project_id=" + project_id);
    }

    componentWillMount() {


        function intersect(a, b) {
            var t;
            if (b.length > a.length) t = b, b = a, a = t; // indexOf to loop over shorter
            return a.filter(function (e) {
                return b.indexOf(e) > -1;
            });
        }

        const {dispatch, user} = this.props;
        dispatch({type: "HOME"});
        dispatch(userActions.fetchHomeProject(this.props.user));


        RESTService.fetchHomeProject(this.props.user)
            .then(
                result => {
                    console.log(result.result);
                    this.setState({homecontent: result.result});
                    this.setState({homecontentmaster: result.result});


                    console.log("User Skills-");
                    user.skills=user.skills+",";


                    var user_skills = user.skills.trim().split(",");
                    console.log(user_skills);

                    var temp_array = [];
                    var j = 0;
                    console.log("Inside will mount-");
                    for (var i = 0; i < result.result.length; i++) {

                        var res = result.result[i].skills_req.split(",");
                        console.log(res);
                        if (intersect(user_skills, res).length >= 3) {
                            console.log("Yes");
                            temp_array[j] = result.result[i];
                            j++;
                        }
                    }
                    if (temp_array.length > 0) {
                        this.setState({relevantcontent: temp_array});
                        this.setState({relevantcontentmaster: temp_array});
                    }
                    else {
                        this.setState({relevantcontent: false});
                        this.setState({relevantcontentmaster: false});
                    }


                }
            )


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

    handleInputChange_table1(e) {
        e.preventDefault();

        var temp_array = [];
        this.setState({currentPageNumber_table1: 1});

        var j = 0;
        for (var i = 0; i < this.state.homecontentmaster.length; i++) {
            if (this.state.homecontentmaster[i].title.includes(e.target.value) || this.state.homecontentmaster[i].skills_req.includes(e.target.value)) {
                temp_array[j] = this.state.homecontentmaster[i]
                j++;
            }
        }
        if (temp_array.length > 0)
            this.setState({homecontent: temp_array});
        else
            this.setState({homecontent: false});
    }


    handleInputChange_table2(e) {
        e.preventDefault();

        var temp_array = [];
        this.setState({currentPageNumber_table2: 1});

        var j = 0;
        for (var i = 0; i < this.state.relevantcontentmaster.length; i++) {
            if (this.state.relevantcontentmaster[i].title.includes(e.target.value) || this.state.relevantcontentmaster[i].skills_req.includes(e.target.value)) {
                temp_array[j] = this.state.relevantcontentmaster[i]
                j++;
            }
        }
        if (temp_array.length > 0)
            this.setState({relevantcontent: temp_array});
        else
            this.setState({relevantcontent: false});
    }

    render() {
        //Pagination variables for table1
        let currentItems_table1=[];
        const pageNumbers_table1 = [];

        const {user} = this.props;

        if (this.state.homecontent && (this.state.homecontent.length > 0)) {

            //Pagination logic
            const {currentPageNumber_table1, itemsPerPage} = this.state;
            // Logic for displaying current items
            const indexOfLastItem = currentPageNumber_table1 * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            currentItems_table1 = this.state.homecontent.slice(indexOfFirstItem, indexOfLastItem);


            // Logic for displaying page numbers
            for (let i = 1; i <= Math.ceil(this.state.homecontent.length / itemsPerPage); i++) {
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


        if (this.state.relevantcontent && (this.state.relevantcontent.length > 0)) {

            //Pagination logic
            const {currentPageNumber_table2, itemsPerPage} = this.state;
            // Logic for displaying current items
            const indexOfLastItem = currentPageNumber_table2 * itemsPerPage;
            const indexOfFirstItem = indexOfLastItem - itemsPerPage;
            currentItems_table2 = this.state.relevantcontent.slice(indexOfFirstItem, indexOfLastItem);


            // Logic for displaying page numbers
            for (let i = 1; i <= Math.ceil(this.state.relevantcontent.length / itemsPerPage); i++) {
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
    console.log(`/ProfileImage/${user.username}.jpg`);

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

                                    <h3>All Open Projects<span><input
                                        placeholder="Search..."
                                        ref={input => this.search = input}
                                        className={'searchbar'}
                                        onChange={this.handleInputChange_table1.bind(this)}

                                    /></span></h3>
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


                                        {this.state.homecontent &&
                                        currentItems_table1.map((data) =>


                                            <div className="ProjectFeed" key={data._id}>

                                                <div className="col-sm-1 col-sm-offset-0">

                                                    <img className="FreeLancerIcon" src={Icon} alt="FreelancerIcon"/>

                                                </div>
                                                <div className="col-sm-4 col-sm-offset-0">

                                                    <a href={`/BidProject?project_id=${data._id}`}> <span
                                                        className="ProjectTitle"> {data.title.substring(0, 20)}{(data.title.length > 20) && `...`}</span></a>
                                                    <br/>
                                                    <span
                                                        className="ProjectDescription"> {data.description.substring(0, 35)}{(data.description.length > 35) && `...`}</span>
                                                    <br/>
                                                    <br/>
                                                    <span
                                                        className="ProjectSkillsReq">  {data.skills_req.substring(0, 20)}{(data.skills_req.length > 20) && `...`}</span>


                                                </div>
                                                <div className="col-sm-2 col-sm-offset-0">


                                                    {data.bids.length}


                                                </div>
                                                <div className="col-sm-2 col-sm-offset-0">

                                                    <span className="shiftsmallleft"><a
                                                        href={`/ViewProfilePage/${data.emp_username}`}>@{data.emp_username}</a></span>

                                                </div>
                                                <div className="col-sm-3 col-sm-offset-0">

                                                    <span className="shiftsmallleft">{data.budget_range}</span>
                                                    <br/><br/>
                                                    <button className="btn btn-primary" id="BidProjectButton"
                                                            value={data._id}
                                                            onClick={this.handleSubmit.bind(this, "/BidProject")}>Bid
                                                        Now
                                                    </button>

                                                </div>


                                            </div>
                                        )
                                        }
                                    </div>
                                </div>
                                <div className="pagination">
                                    <ul id="page-numbers" className="pagination">
                                        {renderPageNumbers_table1}
                                    </ul>
                                </div>


                                <div>

                                    <h3>Relevant Projects<span><input
                                        placeholder="Search..."
                                        ref={input => this.search = input}
                                        className={'searchbar'}
                                        onChange={this.handleInputChange_table2.bind(this)}

                                    /></span></h3>
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


                                        {this.state.relevantcontent &&
                                        currentItems_table2.map((data) =>


                                            <div className="ProjectFeed" key={data._id}>

                                                <div className="col-sm-1 col-sm-offset-0">

                                                    <img className="FreeLancerIcon" src={Icon} alt="FreelancerIcon"/>

                                                </div>
                                                <div className="col-sm-4 col-sm-offset-0">

                                                    <a href={`/BidProject?project_id=${data._id}`}> <span
                                                        className="ProjectTitle"> {data.title.substring(0, 20)}{(data.title.length > 20) && `...`}</span></a>
                                                    <br/>
                                                    <span
                                                        className="ProjectDescription"> {data.description.substring(0, 35)}{(data.description.length > 35) && `...`}</span>
                                                    <br/>
                                                    <br/>
                                                    <span
                                                        className="ProjectSkillsReq">  {data.skills_req.substring(0, 20)}{(data.skills_req.length > 20) && `...`}</span>


                                                </div>
                                                <div className="col-sm-2 col-sm-offset-0">


                                                    {data.bids.length}


                                                </div>
                                                <div className="col-sm-2 col-sm-offset-0">

                                                    <span className="shiftsmallleft"><a
                                                        href={`/ViewProfilePage/${data.emp_username}`}>@{data.emp_username}</a></span>

                                                </div>
                                                <div className="col-sm-3 col-sm-offset-0">

                                                    <span className="shiftsmallleft">{data.budget_range}</span>
                                                    <br/><br/>
                                                    <button className="btn btn-primary" id="BidProjectButton"
                                                            value={data._id}
                                                            onClick={this.handleSubmit.bind(this, "/BidProject")}>Bid
                                                        Now
                                                    </button>

                                                </div>


                                            </div>
                                        )
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

                        <div className="col-sm-3 col-sm-offset-0">
                            <div className="col-md-12 col-md-offset-0">
                                <div className="panel panel-primary" id="shadowpanelUser">

                                    <div className="col-sm-5 col-sm-offset-0">
                                        <div className="col-md-12 col-md-offset-0">
                                            <img className="FreeLancerIcon"
                                                 src={`/ProfileImage/${user.username}.jpg`}
                                                 onError={(e) => {
                                                     e.target.src = ProfileImage
                                                 }}/>
                                        </div>
                                    </div>


                                    <div className="col-sm-7 col-sm-offset-0">
                                        <div className="col-md-11 col-md-offset-0">
                                            <h5><b>Welcome back,</b></h5>
                                            <h4><b><a href={`/MyProfile`}>@{user.username}</a></b></h4>
                                        </div>
                                    </div>

                                    <div className="col-sm-12 col-sm-offset-0">

                                            <button className="btn btn-primary" id="TransactionButton" onClick={() => {
                                                history.push("/TransactionManager");
                                            }}> Transaction Manager </button>

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