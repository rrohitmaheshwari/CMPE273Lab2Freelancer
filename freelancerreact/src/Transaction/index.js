import React from 'react';
import {connect} from 'react-redux';

import ProfileImage from '../Images/ProfileImage.png';
import {RESTService} from "../API";

import ReactHighcharts from 'react-highcharts';
import {history} from "../Helpers";
import {userActions} from "../Actions"; // Expects that Highcharts was loaded in the code.


class Transaction extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            incoming: 100,
            outgoing: 100,
            Add_Money: false,
            Withdraw_Money: false,
            my_transaction_details_status: false,
            my_transaction_details: [],
            my_transaction_details_master: [],
        };

    }


    componentWillMount() {
        const {dispatch, user} = this.props;
        dispatch({type: "TRANSACTION"});


        RESTService.getMyTransactionDetails()
            .then(
                response => {
                    console.log(response.result.length);
                    if (response.result.length > 0)
                        this.setState({my_transaction_details_status: true});
                    this.setState({my_transaction_details: response.result});
                    this.setState({my_transaction_details_master: response.result});

                    console.log("this.state.getMyTransactionDetails");
                    console.log(this.state.my_transaction_details_master);

                    var incoming = 0, outgoing = 0;

                    for (var i = 0; i < response.result.length; i++) {
                        if (response.result[i].type === "Add") {

                            incoming += response.result[i].amount;
                        }
                        else if (response.result[i].type === "Withdraw") {

                            outgoing += response.result[i].amount;
                        }

                        else if (response.result[i].type === "Transfer" && response.result[i].from === user.username) {

                            outgoing += response.result[i].amount;
                        }
                        else if (response.result[i].type === "Transfer" && response.result[i].to === user.username) {

                            incoming += response.result[i].amount;
                        }
                    }
                    this.setState({incoming: incoming});
                    this.setState({outgoing: outgoing});


                },
                error => {
                    console.log("Error!");
                    console.log(error);


                }
            );


    }


    handleAddMoney = (event) => {

        const {user} = this.props;

        event.preventDefault();


        const Transaction = {
            from: user.username,
            to: user.username,
            type: "Add",
            amount: this.refs.Add.value,
            project: '',
        };


        RESTService.postTransaction(Transaction)
            .then(
                response => {
                    this.refs.Add.value = "";
                    this.refs.Card.value = "";
                    this.refs.CVV.value = "";
                    window.alert(response.data.message);
                    this.setState({Add_Money: false,});


                    RESTService.getMyTransactionDetails()
                        .then(
                            response => {
                                console.log(response.result.length);
                                if (response.result.length > 0)
                                    this.setState({my_transaction_details_status: true});
                                this.setState({my_transaction_details: response.result});
                                this.setState({my_transaction_details_master: response.result});

                                console.log("this.state.getMyTransactionDetails");
                                console.log(this.state.my_transaction_details_master);

                                var incoming = 0, outgoing = 0;

                                for (var i = 0; i < response.result.length; i++) {
                                    if (response.result[i].type === "Add") {

                                        incoming += response.result[i].amount;
                                    }
                                    else if (response.result[i].type === "Withdraw") {

                                        outgoing += response.result[i].amount;
                                    }
                                    else if (response.result[i].type === "Transfer" && response.result[i].from === user.username) {

                                        outgoing += response.result[i].amount;
                                    }
                                    else if (response.result[i].type === "Transfer" && response.result[i].to === user.username) {

                                        incoming += response.result[i].amount;
                                    }
                                }
                                this.setState({incoming: incoming});
                                this.setState({outgoing: outgoing});


                            },
                            error => {
                                console.log("Error!");
                                console.log(error);


                            }
                        );


                },
                error => {

                }
            );

    }


    handleWithdrawMoney = (event) => {

        const {user} = this.props;

        event.preventDefault();


        const Transaction = {
            from: user.username,
            to: user.username,
            type: "Withdraw",
            amount: this.refs.Withdraw.value,
            project: '',
        };


        RESTService.postTransaction(Transaction)
            .then(
                response => {
                    this.refs.Withdraw.value = "";
                    this.refs.Account.value = "";
                    window.alert(response.data.message);
                    this.setState({Withdraw_Money: false,});


                    RESTService.getMyTransactionDetails()
                        .then(
                            response => {
                                console.log(response.result.length);
                                if (response.result.length > 0)
                                    this.setState({my_transaction_details_status: true});
                                this.setState({my_transaction_details: response.result});
                                this.setState({my_transaction_details_master: response.result});

                                console.log("this.state.getMyTransactionDetails");
                                console.log(this.state.my_transaction_details_master);

                                var incoming = 0, outgoing = 0;

                                for (var i = 0; i < response.result.length; i++) {
                                    if (response.result[i].type === "Add") {

                                        incoming += response.result[i].amount;
                                    }
                                    else if (response.result[i].type === "Withdraw") {

                                        outgoing += response.result[i].amount;
                                    }
                                    else if (response.result[i].type === "Transfer" && response.result[i].from === user.username) {

                                        outgoing += response.result[i].amount;
                                    }
                                    else if (response.result[i].type === "Transfer" && response.result[i].to === user.username) {

                                        incoming += response.result[i].amount;
                                    }
                                }
                                this.setState({incoming: incoming});
                                this.setState({outgoing: outgoing});


                            },
                            error => {
                                console.log("Error!");
                                console.log(error);


                            }
                        );

                },
                error => {

                }
            );


    }


    render() {
        const config = {

            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: 'Incoming/Outgoing Income'
            },
            tooltip: {
                pointFormat: ' <b>{point.percentage:.1f} %</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.y:.1f}$',

                    }
                }
            },
            series: [{
                name: 'Total',
                colorByPoint: true,
                data: [{
                    name: 'Incoming',
                    y: this.state.incoming,
                    sliced: true,
                    selected: true
                }, {
                    name: 'Outgoing',
                    y: this.state.outgoing,
                }]
            }],
            credits: {
                enabled: false
            },

        };

        const {user} = this.props;
        return (
            <div>


                <div className="jumbotron">

                    <div>
                        <div className="col-sm-7 col-sm-offset-1">
                            <div className="col-md-12 col-md-offset-0">


                                <div className="panel panel-primary" id="shadowpanel">


                                    <ReactHighcharts config={config} ref="chart"></ReactHighcharts>
                                    <div style={{marginLeft: 40, marginBottom: 40}}>
                                        <button className="btn btn-primary" onClick={() => {

                                            this.setState({Add_Money: !this.state.Add_Money})

                                        }}
                                        >Add Money
                                        </button>
                                        <button style={{marginLeft: 40}} className="btn btn-primary" onClick={() => {

                                            this.setState({Withdraw_Money: !this.state.Withdraw_Money})

                                        }}>Withdraw Money
                                        </button>
                                    </div>
                                </div>


                                {this.state.Add_Money &&
                                <div className="panel panel-primary" id="shadowpanel">


                                    <button type="button" className="close" aria-label="Close" onClick={() => {

                                        this.setState({Add_Money: !this.state.Add_Money})

                                    }}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    <form onSubmit={this.handleAddMoney} style={{marginLeft: 40, marginTop: 30}}>
                                        <p>Add Money</p>
                                        <br/>
                                        <div className="input-group">
                                            <span className="input-group-addon">$</span>
                                            <input type="text" className="form-control" name="Add" ref="Add"
                                                   placeholder="Add Amount" required={true}/>
                                        </div>
                                            <br/>
                                        <div className="input-group">
                                            <span className="input-group-addon"><i
                                                class="glyphicon glyphicon-credit-card"/></span>
                                            <input type="text" className="form-control" name="Card" ref="Card"
                                                   placeholder="Card"
                                                   required={true}/>
                                        </div>
                                        <br/>

                                        <div className="input-group">
                                            <span className="input-group-addon">CVV</span>
                                            <input type="text" className="form-control" name="CVV" ref="CVV"
                                                   placeholder="XXX"
                                                   required={true}/>
                                        </div>
                                        <br/>

                                        <div className="text-right">
                                            <button className="btn btn-primary" id="BidProjectButton" style={{marginRight: 40,marginBottom: 30}}> Submit</button>
                                        </div>
                                    </form>


                                </div>

                                }
                                {this.state.Withdraw_Money &&
                                <div className="panel panel-primary" id="shadowpanel">
                                    <button type="button" className="close" aria-label="Close" onClick={() => {

                                        this.setState({Withdraw_Money: !this.state.Withdraw_Money})

                                    }}><span aria-hidden="true">&times;</span>
                                    </button>
                                    <form onSubmit={this.handleWithdrawMoney} style={{marginLeft: 40, marginTop: 30}}>
                                        <p>Withdraw Money</p>
                                        <br/>

                                        <div className="input-group">
                                            <span className="input-group-addon"><i
                                                class="glyphicon glyphicon-piggy-bank"/></span>
                                            <input type="text" className="form-control" name="Withdraw" ref="Withdraw"
                                                   placeholder="Withdraw Amount" required={true}/>
                                        </div>
                                        <br/>
                                        <div className="input-group">
                                            <span className="input-group-addon"><i
                                                class="glyphicon glyphicon-lock"/></span>
                                            <input type="text" className="form-control" name="Account" ref="Account"
                                                   placeholder="Account Number" required={true}/>
                                        </div>

                                        <br/>
                                        <div className="text-right">
                                            <button className="btn btn-primary" id="BidProjectButton" style={{marginRight: 40,marginBottom: 30}}> Submit</button>
                                        </div>

                                    </form>


                                </div>
                                }


                                {this.state.my_transaction_details_status &&
                                <div className="panel panel-primary" id="shadowpanel">
                                    <table className="m-table">
                                        <thead>
                                        <tr>

                                            <th>Type</th>
                                            <th>From</th>
                                            <th>To</th>
                                            <th>Amount</th>
                                            <th>Date</th>
                                            <th>Project ID</th>
                                        </tr>
                                        </thead>
                                        <tbody>


                                        {this.state.my_transaction_details.map((data) =>
                                            <tr key={data._id}>
                                                <td>{data.type}</td>
                                                <td><a href={`/ViewProfilePage/${data.from}`}>@{data.from}</a></td>
                                                <td><a href={`/ViewProfilePage/${data.to}`}>@{data.to}</a></td>
                                                <td>{data.amount}</td>
                                                <td>{data.Date}</td>
                                                <td>{data.project}</td>
                                            </tr>
                                        )
                                        }

                                        </tbody>
                                    </table>

                                </div>


                                }


                                {!this.state.my_transaction_details_status &&
                                <div className="panel panel-primary" id="shadowpanel">
                                    <p>No Transactions yet</p>

                                </div>


                                }

                            </div>
                        </div>

                        <div className="col-sm-3 col-sm-offset-0">
                            <div className="col-md-12 col-md-offset-0">
                                <div className="panel panel-primary" id="shadowpanelUser">

                                    <div className="col-sm-5 col-sm-offset-0">
                                        <div className="col-md-12 col-md-offset-0">
                                            <img className="FreeLancerIcon"
                                                 src={`http://54.89.108.85:3001/ProfileImage/${user.username}.jpg`}
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
    return {
        user
    };
}

const connectedTransactionPage = connect(mapStateToProps)(Transaction);
export {connectedTransactionPage as Transaction};