const expect = require('expect');
const request = require('supertest');
const app = require('../app');
const User = require('../model/user');
const mongoose = require('../model/mongoose');
const Mockgoose = require('mockgoose').Mockgoose;
const mockgoose = new Mockgoose(mongoose); //mockgoose intercepts that connection

let Cookies;

before(function (done) {
    mockgoose.prepareStorage().then(function () {
        //basically simulates your current database, so you can continue using the methods save, find, etc from mongoose.
        mongoose.connect('mongodb://54.89.108.85:27017/freelancerdb', function (err) {
            done(err);
        });
    });
});

after(function (done) {
    mockgoose.helper.reset().then(() => {
        done();
    });
});

describe('POST: /users/register', () => {

    it('should create a new user', (done) => {

        let validUser = {
            username: 'testuser',
            email: 'testuser@gmail.com',
            password: 'testuser'
        };

        request(app)
            .post('/users/register')
            .send(validUser)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});

describe('POST: /users/authenticate', () => {

    it('should login valid user', (done) => {

        let testValidUser = {
            username: 'testuser',
            password: 'testuser'
        };

        request(app)
            .post('/users/authenticate')
            .send(testValidUser)
            .expect(200)
            .expect((res) => {
                // save cookie for future use
                Cookies = res.headers['set-cookie'].pop().split(';')[0];
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });

    });

    it('should reject invalid user for logging in', (done) => {

        let testInvalidLogin = {
            username: 'testuser',
            password: 'invalidtestuser'
        };

        request(app)
            .post('/users/authenticate')
            .send(testInvalidLogin)
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});

describe('POST: /home/getdetailst', () => {

    it('should get home details', (done) => {

        let testInvalidLogin = {
            username: 'testuser'
        };
        request(app)
            .post('/home/getdetails')
            .send(testInvalidLogin)
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});

describe('POST: /user/logout', () => {

    it('should logout user', (done) => {

        let req = request(app).post('/user/logout');
        // Set cookie to get saved user session
        req.cookies = Cookies;

        req.expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});