/* eslint-disable dot-notation */
/* eslint-disable no-multi-assign */
/*

// This test has trouble connecting to database
// test manually with swagger

'use strict';

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
  it('/adoptees : 200', async () => {
    // Goal: Create an application user
    // Strategy: only guest token can signin
    //           set validation in route route.options.auth
    // const username = 'new@user.com';
    const payload = new TestTokenPayload().guestTokenPayload();
    const secret = process.env.JWT_SECRET;

    // var db = request.server.plugins['hapi-sequelized'].models;

    // const JWT = server.plugins['Jwt'];
    // const token = `Bearer ${Jwt.token.generate(payload, secret)}`;
    // const token = `Bearer ${JWT.token.generate(payload, secret)}`;

    let token = Jwt.token.generate(payload, secret);

    token = `Bearer ${token}`;

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
    console.log('test adoptee', res.result);
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');

    // expect(res.result.token).toBeDefined();
  });
});
*/
