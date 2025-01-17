import * as chai from 'chai';
import {default as chaiHttp, request} from "chai-http";
import sinon from 'sinon';
import { expect } from 'chai';

import server from '../../../server.js';
import User from '../models/classes/User.js'; 

chai.use(chaiHttp); 

describe('Authentication API', () => {

  let mockPassport;

  beforeEach(() => {
    mockPassport = {
      authenticate: sinon.stub() 
    };
  });
  
  afterEach(() => {
    sinon.restore(); // Restore original behavior after each test
  });

  describe('POST /auth/signup', () => {
    //TODO: fix and unskip this failing test
    it.skip('should create a new user', (done) => {
      const mockUser = new User({ username: 'testuser', email: 'test@example.com', password: 'password123' });
      sinon.stub(User, 'findOne').resolves(null); // Mock User.findOne to return null (no existing user)
      sinon.stub(mockUser, 'save').resolves(); // Mock User.save to succeed

      request.execute(server)
        .post('/auth/signup')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(201);
          expect(res.body).to.have.property('message').to.equal('Signup successful');
          done();
        });
    });

    it('should return error for existing email', (done) => {
      const existingUser = new User({ email: 'test@example.com' });
      sinon.stub(User, 'findOne').resolves(existingUser); // Mock User.findOne to return an existing user

      request.execute(server)
        .post('/auth/signup')
        .send({ username: 'testuser', email: 'test@example.com', password: 'password123' })
        .end((err, res) => {
          expect(err).to.be.null;
          expect(res).to.have.status(400);
          expect(res.body).to.have.property('message').to.equal('Email already exists');
          done();
        });
    });
  });

  describe('POST /auth/login', () => {
    //TODO: fix this failing test and unskip it
    it.skip('should login with valid credentials', (done) => {
      const mockUser = new User({ email: 'test@example.com', password: 'password123' });
      mockPassport.authenticate.callsFake((strategy, callback) => callback(null, mockUser));// Mock passport.authenticate

      request.execute(server)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'password123' })
        .end((err, res) => {
          expect(err).to.be.null;
          // Login redirects, so check for redirect.
          expect(res).to.have.status(302); // Expect a redirect status code
          done();
        });
    });

    //TODO: fix this failing test and unskip it
    it.skip('should return error for invalid credentials', (done) => {

      mockPassport.authenticate.callsFake((strategy, callback) => callback(null, mockUser));// Mock passport.authenticate to fail

      request.execute(server)
        .post('/auth/login')
        .send({ email: 'test@example.com', password: 'wrongpassword' })
        .end((err, res) => {
          expect(err).to.be.null;
          // Login redirects on error, so check for redirect.
          expect(res).to.have.status(302); // Expect a redirect status code
          done();
        });
    });
  });

  // More tests here for logout, forgot password, etc. 
  // TO-DO Two tests are currently throwing errors, check these later

});