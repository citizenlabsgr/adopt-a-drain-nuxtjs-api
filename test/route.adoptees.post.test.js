'use strict';
/* eslint-disable dot-notation */
/* eslint-disable no-multi-assign */


// This test has trouble connecting to database
// test manually with swagger


const Lab = require('@hapi/lab');

const { expect } = require('@hapi/code');

const {
  after,
  before,
  describe,
  it,
} = exports.lab = Lab.script();

const Jwt = require('@hapi/jwt');

const { init } = require('../lib/server');

const TestTokenPayload = require('./util/token_payload_test');

// * States
// * Fail on configuration error
// * 404 when no points are Not Found
// * 200 when point found 

describe('Adoptees Route ', () => {
  let server = null;

  before(async () => {
      server = await init();
    
  });

  after(async () => {
    // console.log('restricted server stop');
    // delete test user

      await server.stop();
    
    // delete record
  });

  // adoptees 
  it('/adoptees Not Found: 200', async () => {

    const payload = new TestTokenPayload().guestTokenPayload();
    const secret = process.env.JWT_SECRET;

    let token = Jwt.token.generate(payload, secret);

    token = `Bearer ${token}`;
    // console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);
    // console.log('token', token);

    const res = await server.inject({
      method: 'post',
      url: '/adoptees',
      headers: {
        authorization: token,
        rollback: true,
      },
      payload: {
        "west": 0.0, "east": 2.0, "north": 2.0, "south": 0.0
      },
    });
    // console.log('test adoptee', res.result);
    // expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    // expect(res.result.criteria).to.exist();
    // expect(res.result.criteria.sk).to.equal('const#ADOPTEE');

    // expect(res.result.token).toBeDefined();
    
  });
});

