import * as chai from 'chai';
import {default as chaiHttp, request} from "chai-http";
import sinon from 'sinon';
import { expect } from 'chai';

import server from '../../../server.js';

chai.use(chaiHttp); 

describe('Dashboard API', () => {
  let mockPassport;

  beforeEach(() => {
    mockPassport = {
      authenticate: sinon.stub() 
    };
  });

  afterEach(() => {
    sinon.restore(); // Restore original behavior after each test
  });

  //TODO: fix this failing test and reinstate it
  it.skip('should return 401 if user is not authenticated', async () => {
    const res = await request(server)
      .get('/medications')
      .send();

    expect(res).to.have.status(401);
  });
});