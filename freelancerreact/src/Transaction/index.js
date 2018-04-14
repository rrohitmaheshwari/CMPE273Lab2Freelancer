import React from 'react';
import {connect} from 'react-redux';

import ProfileImage from '../Images/ProfileImage.png';
import {RESTService} from "../API";

import ReactHighcharts from 'react-highcharts'; // Expects that Highcharts was loaded in the code.


class Transaction extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            incoming: 100,
            outgoing: 200,
            Add_Money: true,
            Withdraw_Money: true,


        };

    }


    componentWillMount() {
        const {dispatch} = this.props;
        dispatch({type: "TRANSACTION"});


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

                                    <button className="btn btn-primary" onClick={() => {

                                        this.setState({Add_Money: !this.state.Add_Money})

                                    }}
                                    >Add Money
                                    </button>
                                    <button className="btn btn-primary" onClick={() => {

                                        this.setState({Withdraw_Money: !this.state.Withdraw_Money})

                                    }}>Withdraw Money
                                    </button>

                                </div>


                                {this.state.Add_Money &&
                                <div className="panel panel-primary" id="shadowpanel">




                                    <button type="button" className="close" aria-label="Close" onClick={() => {

                                        this.setState({Add_Money: !this.state.Add_Money})

                                    }}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                    <p>Add Money</p>
                                    <br/>
                                    <div className="input-group">
                                        <span className="input-group-addon">$</span>
                                        <input type="text" className="form-control" name="add" placeholder="Add Amount"/>
                                    </div>

                                    <div className="input-group">
                                        <span className="input-group-addon"><i class="glyphicon glyphicon-credit-card"/></span>
                                        <input type="text" className="form-control" name="Card" placeholder="Card"/>
                                    </div>

                                    <div className="input-group">
                                        <span className="input-group-addon">CVV</span>
                                        <input type="text" className="form-control" name="CVV" placeholder="XXX"/>
                                    </div>


                                    <div className="text-right">
                                    <button className="btn btn-primary" id="BidProjectButton"> Submit</button>
                                    </div>




                                </div>

                                }
                                {this.state.Withdraw_Money &&
                                <div className="panel panel-primary" id="shadowpanel">
                                    <button type="button" className="close" aria-label="Close" onClick={() => {

                                        this.setState({Add_Money: !this.state.Add_Money})

                                    }}><span aria-hidden="true">&times;</span>
                                    </button>
                                    <p>Withdraw Money</p>
                                    <br/>

                                    <div className="input-group">
                                        <span className="input-group-addon"><i class="glyphicon glyphicon-piggy-bank"/></span>
                                        <input type="text" className="form-control" name="add" placeholder="Withdraw Amount"/>
                                    </div>

                                    <div className="input-group">
                                        <span className="input-group-addon"><i class="glyphicon glyphicon-lock"/></span>
                                        <input type="text" className="form-control" name="Card" placeholder="Account Number"/>
                                    </div>




                                    <div className="text-right">
                                        <button className="btn btn-primary" id="BidProjectButton"> Submit</button>
                                    </div>




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
                                                 src={`http://localhost:3001/ProfileImage/${user.username}.jpg`}
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