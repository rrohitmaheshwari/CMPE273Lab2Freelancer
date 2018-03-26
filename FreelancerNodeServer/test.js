var http = require('http');
var assert = require('assert');
var should = require('should');

var expect = require('chai').expect;
//var server = require('./server');
var request = require('supertest');

var server = require('./bin/www');

const userCredentials = {
    username: 'Rohit',
    password: 'Rohit'
};

const signup = {
    email: 'rohitmaheshwari07@gmail.com',
    username: 'rrohitm',
    password: 'rrohitm'
};

const summary = {
    username: 'Rohit',
    summary: 'Summary data'
};

const updateName = {
    username: 'Rohit',
    name: 'Rohit Maheshwari'
};

const getDetails = {
    username: 'Rohit'
};

var authenticatedUser = request.agent(server);

describe('Server test', function() {

    describe('Log in', function () {
        it('Should log in the user successfully', function (done) {

            authenticatedUser
                .post('/users/authenticate')
                .send(userCredentials)
                .end(function (err, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
        });
    });

    describe('Sign up', function () {
        it('cannot Sign up the user because duplicate email/username', function (done) {
            authenticatedUser
                .post('/users/register')
                .send(signup)
                .end(function (err, response) {
                    expect(response.statusCode).to.equal(400);
                    done();
                });
        });
    });

    describe('Update Summary', function () {
        it('cannot Update Summary because user is not authenticated', function (done) {
            authenticatedUser
                .post('/users/updateSummary')
                .send(summary)
                .end(function (err, response) {
                    expect(response.statusCode).to.equal(404);
                    done();
                });
        });
    });

    describe('Get Details', function () {
        it('Cannot Get Details because user is not authenticated', function (done) {
            authenticatedUser
                .post('/home/getdetails')
                .send(getDetails)
                .end(function (err, response) {
                    expect(response.statusCode).to.equal(201);
                    done();
                });
        });
    });

    describe('Update Name', function () {
        it('Cannot update Name because user is not authenticated', function (done) {
            authenticatedUser
                .post('/users/updateName')
                .send(updateName)
                .end(function (err, response) {
                    expect(response.statusCode).to.equal(404);
                    done();
                });
        });
    });
});