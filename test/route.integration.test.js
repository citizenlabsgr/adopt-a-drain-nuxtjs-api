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
const UserTokenPayload = require('../lib/auth/token_payload_user');
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

  // -----------------------------------------
  // signin
  // -----------------------------------------

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
        apidebug: false,
        apitest: testForm, 
        apitimeout: 1
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

  });
  // -----------------------------------------
  // signup
  // -----------------------------------------
  
  it('API /signup : guest_token can POST Signup, 200', async () => {
    // Goal: Create an application user
    // Strategy: only guest token can signin
    //           set validation in route route.options.auth
    
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
  // -----------------------------------------
  // adoptees
  // -----------------------------------------
  
  it('API /adoptees POST 200', async () => {
   //  change /adoptees to GET and pass the token 
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

    expect(res.result.status).to.equal('404');
    expect(res.result.selection).to.exist();
    expect(res.result.selection).to.equal([]);

  });
  // ---------------------------------
  // adopter POST
  // ---------------------------------
  it('API /adopter : user_token can POST, 200', async () => {

    // Goal: adopter  application user
    // Strategy: only user token can signin
    //           set validation in route route.options.auth
    // console.log('/adopter POST test 1');
    
    const username = 'adopter@user.com';
    const key = 'duckduckgoose';
    const scope = 'api_admin';
    const lapse_in_millisec = 5000; // 5 seconds
    // console.log('/adopter POST test 1');
        
    const payload = new UserTokenPayload(username, 
                                         key, 
                                         scope, 
                                         lapse_in_millisec)
                                         .payload();
                                         
    // console.log('/adopter POST test 1.1');
    
    const secret = process.env.JWT_SECRET;
    // console.log('/adopter POST test 1.2');
    
    let token = Jwt.token.generate(payload, secret);
    // console.log('/adopter POST test 2');

    // console.log('/adopter POST token', token);

    token = `Bearer ${token}`;
    
    // test is just for testing dont use in production

    const res = await server.inject({
      method: 'post',
      url: '/adopter',
      headers: {
        authorization: token,
        api_options: {
          debug: false,
          rollback: true
        }
      },
      payload: {
        form: {
          username: username,
          displayname: username,
          password: 'a1A!aaaa'
        },
        user_key: key
      }
    });
    // console.log('/adopter POST test 3');

    // console.log('res', res);
    // console.log('/adopter POST res.result', res.result);

    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    // doesnt return a token... use signin for that
    expect(res.result.insertion).to.exist();

  });
  // ---------------------------------
  // adopter GET
  // ---------------------------------
  
  it('API /adopter : user_token can GET, 200', async () => {

    // Goal: adopter  application user
    // Strategy: only user token can signin
    // Role: api_user, api_admin
   
    const username = 'adopter@user.com';
    const key = 'duckduckgoose';
    const scope = 'api_user';
    const lapse_in_millisec = 5000; // 5 seconds
     
    const payload = new UserTokenPayload(username, 
                                         key, 
                                         scope, 
                                         lapse_in_millisec)
                                         .payload();
                                         
    const secret = process.env.JWT_SECRET;
    
    let token = Jwt.token.generate(payload, secret);
    // --------------------------
    // const guest_payload = new TestTokenPayload().guestTokenPayload();
    let guestToken = Jwt.token.generate(
      new TestTokenPayload().guestTokenPayload(), 
      secret
    );

    // console.log('token', token);

    token = `Bearer ${token}`;
    // const id = request.params.user;
    
    const testForm = {
      username: username,
      displayname: username,
      password: 'a1A!aaaa',
    };
    
    // 
    // test is just for testing dont use in production

    const res = await server.inject({
      method: 'get',
      url: `/adopter/${username}`,
      headers: {
        authorization: token,
        api_options: {
          debug: false,
          test: testForm,
          guest_token: guestToken
        }
      }
    });

    // console.log('res GET ', res.result);
    
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    
    // expect(res.result.token).to.exist();
    // console.log('/adopter GET test out');

  });
/*
  // ---------------------------------
  // adopter DELETE
  // ---------------------------------
  
  it('API /adopter : user_token can DElETE, 200', async () => {

    // Goal: adopter  application user
    // Strategy: only user token can delete
    // Role: api_user
   
    
    const username = 'adopter@user.com';
    const key = 'duckduckgoose';
    const scope = 'api_user';
    const lapse_in_millisec = 5000; // 5 seconds
    
    
    const payload = new UserTokenPayload(username, 
                                         key, 
                                         scope, 
                                         lapse_in_millisec)
                                         .payload();
    
    const secret = process.env.JWT_SECRET;    

    let token = Jwt.token.generate(payload, secret);
    

    token = `Bearer ${token}`;
    // const id = request.params.user;
    
    const testForm = {
      username: username,
      displayname: username,
      password: 'a1A!aaaa',
    };
    
    // 
    // test is just for testing dont use in production

    const res = await server.inject({
      method: 'delete',
      url: `/adopter/${username}`,
      headers: {
        authorization: token,
        api_options: {
          debug: false,
          test: testForm,
          guest_token:  Jwt.token.generate(
            new TestTokenPayload().guestTokenPayload(), 
            secret
          )
        }
      }
    });

    // console.log('res DElETE ', res.result);
    
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    
    expect(res.result.token).to.exist();
    console.log('/adopter DElETE test out');

  });

  // ---------------------------------
  // adopter PUT
  // ---------------------------------
  
  it('API /adopter : user_token can PUT, 200', async () => {

    // Goal: adopter  application user
    // Strategy: only user token can delete
    // Role: api_user

    console.log('/adopter PUT test 1');
    
    // [Token values ]
    const secret = process.env.JWT_SECRET;
    const username = 'adopter@user.com';
    const userId = username;
    const key = 'duckduckgoose';
    const scope = 'api_user';
    const lapse_in_millisec = 5000; // 5 seconds
    
    console.log('/adopter PUT test 2');
    // [Two tokens required to run test guestToken and userToken]
    // [User token calculated from test values]
    const userPayload = new UserTokenPayload(
                                         username, 
                                         key, 
                                         scope, 
                                         lapse_in_millisec)
                                         .payload();

    // [Guest token found in environment]
    let guestToken = Jwt.token.generate(
      new TestTokenPayload().guestTokenPayload(), 
      secret);
    let userToken  = Jwt.token.generate(userPayload, secret);    

    userToken = `Bearer ${userToken}`;
    // [Existing user required to run test]
    const testForm = {
      username: username,
      displayname: username,
      password: 'a1A!aaaa',
    };

    // [Any value can be changed]
    const changeForm = {
      username: 'update@user.com',
      displayname: 'U',
      password: 'b1B!bbbb',
    };

    // [Start the test]
    
    const res = await server.inject({
      method: 'put',
      url: '/adopter',
      headers: {
        authorization: userToken,
        api_options: {
          debug: false,
          test: testForm,
          token:  guestToken
        }
      },
    
      payload: changeForm
    });

    console.log('/adopter PUT test 7');

    console.log('res PUT ', res.result);
    
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    
    expect(res.result.token).to.exist();
    console.log('/adopter PUT test out');

  });
*/

});

