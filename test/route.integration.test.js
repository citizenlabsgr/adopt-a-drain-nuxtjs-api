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

const { init } = require('../lib/server');

const TestTokenPayload = require('../lib/util/token_payload_test');
const UserTokenPayload = require('../lib/auth/token_payload_user');
const adoptee_data = {
  "owners":{
    "duckduckgoose":{
       "username":"adopter@user.com",
       "displayname":"A",
       "password":"a1A!aaaa"
    }
  },
  "data": [
    {"pk":"one", 
     "sk":"const#ADOPTEE", 
     "tk":"1", 
     "form": {"name":"One", "drain_id":"One","type":"TestDrain", "lat":1.0, "lon":1.0}, 
     "owner":"duckduckgoose"
    }, 
    {"pk":"two", 
     "sk":"const#ADOPTEE", 
     "tk":"2", 
     "form": {"name":"Two", "drain_id":"Two","type":"TestDrain","lat":1.0, "lon":1.0}, 
     "owner":"duckduckgoose"
    }, 
    {"pk":"three", 
    "sk":"const#ADOPTEE", 
    "tk":"3", 
    "form": {"name":"Three", "drain_id":"Three","type":"TestDrain","lat":1.0, "lon":1.0}, 
    "owner":"duckduckgoose"
   } 
  ]
};

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
        apitimeout: 1,
        api_options:{
          debug:false,
          test: testForm,
          timeout: 1
        }
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
  // adoptee
  // -----------------------------------------
  
  // [Test adoptee guest with MBR]
  it('API /adoptee guest GET  with MBR 200', async () => {
    const payload = new TestTokenPayload().guestTokenPayload();
    const secret = process.env.JWT_SECRET;
    let token = Jwt.token.generate(payload, secret);
    token = `Bearer ${token}`;
    // token = `("${token}")`;
    // console.log('token', token);
    const res = await server.inject({
      method: 'get',
      url: '/adoptee',
      headers: {
        authorization: token,
        mbr: {"west": 0.0, "east": 2.0, "north": 2.0, "south": 0.0},
        api_options: {
          rollback: true,
          test: adoptee_data,
          debug: false
        }
      }
    });

    // console.log('test adoptee', res.result);

    expect(res.result.status).to.equal('200');
    expect(res.result.selection).to.exist();
    expect(res.result.selection).to.not.equal([]);

  });  
  
  it('API /adoptee POST 200', async () => {
   //  change /adoptees to POST  
    // const payload = new TestTokenPayload().userTokenPayload();
    const key = adoptee_data.data[0].owner;
    const username = adoptee_data.owners[key];
    const lapse_in_millisec=5000;
    const scope = 'api_user';
    const payload = new UserTokenPayload(username, key, scope, lapse_in_millisec).payload();
    const secret = process.env.JWT_SECRET;
    let token = Jwt.token.generate(payload, secret);
    
    let form = {"name":"ABC", "drain_id":"ABC","type":"TestDrain","lat":1.0, "lon":1.0};
    
    token = `Bearer ${token}`;

    const res = await server.inject({
      method: 'post',
      url: '/adoptee',
      headers: {
        authorization: token,
        owner: key,
        api_options: {
          rollback: true,
          debug: false
        }
      },
      payload: form,
    });
    
    // console.log('API /adoptee POST', res.result);

    expect(res.result.status).to.equal('200');
    expect(res.result.insertion).to.exist();
    expect(res.result.insertion).to.not.equal([]);

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
        },
        owner: key
      },
      payload: {
        
          username: username,
          displayname: username,
          password: 'a1A!aaaa'
        
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
    const id = username;
    const key = 'duckduckgoose';
    const scope = 'api_user';
    const lapse_in_millisec = 5000; // 5 seconds
    const secret = process.env.JWT_SECRET;
     
    const payload = new UserTokenPayload(username, 
                                         key, 
                                         scope, 
                                         lapse_in_millisec)
                                         .payload();
                                         
    
    let userToken = Jwt.token.generate(payload, secret);
    // --------------------------
    // [Admin token...generate]
    let adminToken = Jwt.token.generate(
      new TestTokenPayload().adminTokenPayload(username, key), 
      secret);

    userToken = `Bearer ${userToken}`;
    
    const testForm = {
      username: username,
      displayname: username,
      password: 'a1A!aaaa',
    };
    
    // 
    // test is just for testing dont use in production

    const res = await server.inject({
      method: 'get',
      url: `/adopter/${id}`,
      headers: {
        authorization: userToken,
        owner: key,
        api_options: {
          debug: false,
          test: testForm,
          token: adminToken
        }
      }
    });

    // console.log('res GET ', res.result);
    
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    expect(res.result.selection).to.exist();

  });

  // ---------------------------------
  // adopter DELETE
  // ---------------------------------
  
  it('API /adopter : user_token can DElETE, 200', async () => {

    // Goal: adopter  application user
    // Strategy: Insert dummy user, and then remove it.
    // Role: api_user
   
    const username = 'adopter@user.com';
    const id = username;
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
    
    // [Admin token...generate]
    let adminToken = Jwt.token.generate(
      new TestTokenPayload().adminTokenPayload(username, key), 
      secret);
    token = `Bearer ${token}`;

    const testForm = {
      username: username,
      displayname: username,
      password: 'a1A!aaaa',
    };
    
    // 
    // test is just for testing dont use in production

    const res = await server.inject({
      method: 'delete',
      url: `/adopter/${id}`,
      headers: {
        authorization: token,
        owner: key,
        api_options: {
          debug: false,
          test: testForm,
          token:  adminToken
        }
      }
    });

    // console.log('res DElETE ', res.result);
    
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    
    // expect(res.result.token).to.exist();
    // console.log('/adopter DElETE test out');

  });

  // ---------------------------------
  // adopter PUT
  // ---------------------------------
  
  it('API /adopter : user_token can PUT, 200', async () => {

    // Goal: adopter  application user
    // Strategy: 
    // - signup a user, get user id, 
    // - make user token, provide user-token to update
    // - use rollback to get rid of signup          
    // Role: api_user

    
    // [Token values ]
    
    const username = 'adopter@user.com';
    const id = username;
    const key = 'duckduckgoose';
    const scope = 'api_user';
    const lapse_in_millisec = 5000; // 5 seconds
    const secret = process.env.JWT_SECRET;

    // [Two tokens required to run test guestToken and userToken]
    // [User token calculated from test values]
    const userPayload = new UserTokenPayload(
                                         username, 
                                         key, 
                                         scope, 
                                         lapse_in_millisec)
                                         .payload();
    let userToken  = Jwt.token.generate(userPayload, 
                                        secret);    

    // [Admin token...generate]
    let adminToken = Jwt.token.generate(
      new TestTokenPayload().adminTokenPayload(username, key), 
      secret);

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
      url: `/adopter/${id}`,
      headers: {
        authorization: userToken,
        owner: key,
        api_options: {
          debug: false,
          test: testForm,
          token:  adminToken
        }
      },
      payload: changeForm
    });

    // console.log('res PUT ', res.result);
    // console.log('res PUT ', res.result.updation.form.scope);
    
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    expect(res.result.updation.form.scope).to.equal('api_user');
  });

});

