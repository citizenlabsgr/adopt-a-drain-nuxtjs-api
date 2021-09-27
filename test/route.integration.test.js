'use strict';
/* eslint-disable dot-notation */
/* eslint-disable no-console */
/* eslint-disable no-multi-assign */

// This test has trouble connecting to database
// test manually with swagger

const Jwt = require('@hapi/jwt');

// es lint-disable-next-line import/no-extraneous-dependencies
const Lab = require('@hapi/lab');
const { after, before, describe, it } = exports.lab = Lab.script();

// es lint-disable-next-line import/no-extraneous-dependencies
const { expect } = require('@hapi/code');

// const {
//   before, afterEach, describe, it,
// } = exports.lab = Lab.script();

const { init } = require('../lib/server');

const TestTokenPayload = require('./util/token_payload_test');
// const TokenHelper = require('../lib/auth/token_helper');

describe('API Route Tests', () => {
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

  // signin
  it('API /signin : guest_token can POST Signin, 200', async () => {

    // Goal: Singin  application user
    // Strategy: only guest token can signin
    //           set validation in route route.options.auth
    // let username = 'signin@user.com';
    const email = 'existing2@user.com';
    const payload = new TestTokenPayload().guestTokenPayload();
    const secret = process.env.JWT_SECRET;
    // const token_timeout = process.env.TOKEN_TIMEOUT;
    // const old_token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjaXRpemVubGFicy1hcGkiLCJpc3MiOiJjaXRpemVubGFicyIsInN1YiI6ImNsaWVudC1hcGkiLCJ1c2VyIjoiZXhpc3RpbmcyQHVzZXIuY29tIiwic2NvcGUiOiJhcGlfdXNlciIsImp0aSI6InVzZXJuYW1lI2V4aXN0aW5nMkB1c2VyLmNvbSIsImtleSI6Imd1aWQjOWNiMTI0NzgtM2EzYS00ODVlLTgzYjEtZTkwMjcyMzJhZDllIiwiZXhwIjoxNjMyNDczMzM2LjI5ODk3Nn0.RrT7xOsoe_xHxgwXPgDv34MrPO1CQuZBGXcRRSf25No';
    let token = Jwt.token.generate(payload, secret);

    token = `Bearer ${token}`;

    const testForm = {
      username: email,
      displayname: email,
      password: 'a1A!aaaa',
    };
    // Sigin in
    // test is just for testing dont use in production

    const res = await server.inject({
      method: 'post',
      url: '/signin',
      headers: {
        authorization: token,
        debug: true,
        test: testForm, 
        timeout: 1
      },
      payload: {
        username: email,
        password: 'a1A!aaaa',
      },
    });
    
    // console.log('res', res.result);
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    
    expect(res.result.token).to.exist();
    // let TH = new TokenHelper(res.result.token);
    // let atime = TH.getCurrentTime();

    // expect(TH.isExpired()).to.equal(false);
    // let TH_old = new TokenHelper(old_token);
    // expect(TH_old.isExpired()).to.equal(true);
    
    // console.log('getCurrentTime', );
    // console.log('getExpiration ', TH.getExpiration() - atime, );

    // console.log('isExpired', TH.isExpired());
  });

  // signup
  
  it('API /signup : guest_token can POST Signup, 200', async () => {
    // Goal: Create an application user
    // Strategy: only guest token can signin
    //           set validation in route route.options.auth
    // const username = 'new@user.com';
    const username = 'john.newhouser45@newuser.com';

    const payload = new TestTokenPayload().guestTokenPayload();
    const secret = process.env.JWT_SECRET;

    let token = Jwt.token.generate(payload, secret);

    token = `Bearer ${token}`;

    const res = await server.inject({
      method: 'post',
      url: '/signup',
      headers: {
        authorization: token,
        api_options: {
          rollback: true,
          debug: false
        }
      },
      payload: {
        username,
        password: 'a1A!aaaa',
        displayname: 'J',
      },
    });

    // console.log('test signup', res.result);
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');

    // expect(res.result.token).toBeDefined();

  });

  // adoptees
  
  it('API /adoptees : 200', async () => {

    const payload = new TestTokenPayload().guestTokenPayload();
    const secret = process.env.JWT_SECRET;

    let token = Jwt.token.generate(payload, secret);

    token = `Bearer ${token}`;

    const res = await server.inject({
      method: 'post',
      url: '/adoptees',
      headers: {
        authorization: token,
        api_options: {
          rollback: true,
          debug: false
        }
      },
      payload: {
        "west": 0.0, "east": 2.0, "north": 2.0, "south": 0.0
      },
    });
    // console.log('test adoptee', res.result);
    // expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    expect(res.result.selection).to.exist();
    expect(res.result.selection).to.equal([]);
    // expect(res.result.criteria).to.exist();
    // expect(res.result.criteria.sk).to.equal('const#ADOPTEE');

    // expect(res.result.token).toBeDefined();
    
  });
});

