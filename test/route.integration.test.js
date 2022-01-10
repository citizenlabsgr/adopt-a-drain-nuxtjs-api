'use strict';
/* eslint-disable dot-notation */
/* eslint-disable no-console */
/* eslint-disable no-multi-assign */

// This test has trouble connecting to database
// test manually with swagger
// process.emitter.setMaxListeners(15); 
// process.setMaxListeners(15);  // fail

const Jwt = require('@hapi/jwt');
// const Settings = require('../lib/settings.js');
// es lint-disable-next-line import/no-extraneous-dependencies
const Lab = require('@hapi/lab');

// console.log('lab ', Lab);

const { after, before, experiment, test } = exports.lab = Lab.script();
// const { after, before, describe, it } = exports.lab = Lab.script();

// es lint-disable-next-line import/no-extraneous-dependencies
const { expect } = require('@hapi/code');

const { init } = require('../lib/server');
// console.log('dir ',__dirname);
// const TestTokenPayload = require('../lib/util/token_payload_test');
const GuestTokenPayload = require('../lib/auth/token_payload_guest.js');
const UserTokenPayload = require('../lib/auth/token_payload_user.js');
const AdminTokenPayload = require('../lib/auth/token_payload_admin.js');
/*
const adoptee_post_data = {
  "owners":{
    "duckduckgoose":{
       "username":"adopter@user.com",
       "displayname":"A",
       "password":"a1A!aaaa",
       "scope": "api_user"
    }
  },
  "data": [
    {"pk":"drain_id#one", 
     "sk":"const#ADOPTEE", 
     "tk":"guid#1", 
     "form": {"name":"One", "drain_id":"One","type":"TestDrain", "lat":1.0, "lon":1.0}, 
     "owner":"duckduckgoose"
    }, 
    {"pk":"drain_id#two", 
     "sk":"const#ADOPTEE", 
     "tk":"guid#2", 
     "form": {"name":"Two", "drain_id":"Two","type":"TestDrain","lat":1.0, "lon":1.0}, 
     "owner":"duckduckgoose"
    }, 
    {"pk":"drain_id#three", 
    "sk":"const#ADOPTEE", 
    "tk":"guid#3", 
    "form": {"name":"Three", "drain_id":"Three","type":"TestDrain","lat":1.0, "lon":1.0}, 
    "owner":"duckduckgoose"
   } 
  ]
};
*/
experiment('API Route Tests', () => {
  let server = null;
  
  before(async () => {
    server = await init();
  });
  after(async () => {
    // delete test user
    await server.stop();
    // delete record
  });
  
  // -----------------------------------------
  // signup
  // -----------------------------------------
  
  test('1 API /signup POST, api_guest, 200', async () => {
    // Goal: Create an application user
    // Strategy: only guest token can signup
    //           set validation in route route.options.auth
    
    const username = 'john.newhouser45@newuser.com';
    const payload = new GuestTokenPayload().payload();

    const secret = process.env.JWT_SECRET;

    let token = Jwt.token.generate(payload, secret);

    token = `Bearer ${token}`;

    const res = await server.inject({
      method: 'post',
      url: '/signup',
      headers: {
        authorization: token,
        
          rollback: true,
          debug: false
        
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
  // signin
  // -----------------------------------------

  test('2 API /signin POST, payload, guest_token, 200', async () => {

    // Goal: Singin  application user
    // Strategy: only guest token can signin
    //           set validation in route route.options.auth
    
    const email = 'existing2@user.com';
    const payload = new GuestTokenPayload().payload();

    const secret = process.env.JWT_SECRET;

    let token = Jwt.token.generate(payload, secret);

    token = `Bearer ${token}`;
    
    const testForm = {
      username: email,
      displayname: email,
      password: 'a1A!aaaa'
    };
    // Sigin in
    // test is just for testing dont use in production

    const res = await server.inject({
      method: 'post',
      url: '/signin',
      headers: {
        authorization: token,
       
        debug: false,
        test: JSON.stringify(testForm),
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

  });
  
  // -----------------------------------------
  // signin, after an update
  //    /signup   POST
  //    /adopter  PUT
  //    /signin   POST
  // -----------------------------------------

  

  // ---------------------------------

  
  // ---------------------------------

  // ---------------------------------
  
  // ---------------------------------
  // adopter POST
  // ---------------------------------
  test('8 API /adopter POST user_token, 200', async () => {

    // Goal: adopter  application user
    // Strategy: only admin can post using adopter 
    
    
    const username = 'adopterB@user.com';
    const key = 'duckduckgoose';
    // const scope = 'api_admin';
    // const lapse_in_millisec = 5000; // 5 seconds
        
    const payload = new AdminTokenPayload(username, 
                                         key)
                                         .payload();
    const secret = process.env.JWT_SECRET;    
    const token = `Bearer ${Jwt.token.generate(payload, secret)}`;

    // token = `Bearer ${token}`;
    
    // test is just for testing dont use in production

    const res = await server.inject({
      method: 'post',
      url: '/adopter',
      headers: {
        authorization: token,
        
          debug: false,
          rollback: true,
        
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
  // adopter DELETE
  // ---------------------------------
  
  test('10 API /adopter/owner/id DELETE user_token, 200', async () => {

    // Goal: adopter  application user
    // Strategy: Insert dummy user, and then remove it.
    // Role: api_user
    const adopter_data = {
      "owners": {
          "duckduckgoose":{
              "username": "joeadmin@user.com",
              "displayname": "A",
              "password": "a1A!aaaa",
              "scope": "api_admin"
           }
      },
      "data": [
          {"pk":"username#joeadmin@user.com", 
          "sk":"const#USER", 
          "tk":"guid#1", 
          "form": {"username":"joeadmin@user.com", "displayname":"J","password":"a1A!aaaa"}, 
          "owner":"duckduckgoose"
         }
      ]
  };
    
    const username = 'joeadmin@user.com';
    const id = username;
    const key = 'duckduckgoose';
    // const scope = 'api_user';
    // const lapse_in_millisec = 5000; // 5 seconds
    
    const payload = new UserTokenPayload(username, 
                                         key)
                                         .payload();
    
    const secret = process.env.JWT_SECRET;    

    let token = Jwt.token.generate(payload, secret);
    let owner = 'duckduckgoose';

    token = `Bearer ${token}`;
 
  
    // test is just for testing dont use in production

    const res = await server.inject({
      method: 'delete',
      url: `/adopter/${owner}/${id}`,
      headers: {
        authorization: token,
        
          debug: false,
          test: JSON.stringify(adopter_data)
        
      }
    });

    // console.log('res DELETE ', res.result);
    
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    
    // expect(res.result.token).to.exist();
    // console.log('/adopter DElETE test out');

  });
  // ---------------------------------
  // adopter GET
  // ---------------------------------
  // [Add Test data]
  // [Setup Test Token]
  // [Inject Test into Server]
  // [Check results]
  
  test('11 API /adopter/owner/id GET user_token, 200', async () => {

    // Goal: adopter 
    // Strategy: add test adopter, get adopter, rollback db 
    // Role: 
    const adopter_data = {
      "owners": {
          "duckduckgoose":{
              "username": "user@user.com",
              "displayname": "A",
              "password": "a1A!aaaa",
              "scope": "api_admin"
           }
      },
      "data": [
          {"pk":"username#user@user.com", 
          "sk":"const#USER", 
          "tk":"guid#1", 
          "form": {"username":"user@user.com", "displayname":"J","password":"a1A!aaaa"}, 
          "owner":"duckduckgoose"
         }
      ]
    };
    const username = adopter_data.data[0].form.username; // 'userC@user.com';
    const id = username;
    const key = adopter_data.data[0].owner;
    // const scope = 'api_user';
    // const lapse_in_millisec = 5000; // 5 seconds
    const secret = process.env.JWT_SECRET;
     
    const payload = new UserTokenPayload(username, 
                                         key)
                                         .payload();
                                         
    
    let userToken = Jwt.token.generate(payload, secret);
    const owner = key;
    // --------------------------
    // [Admin token...generate]
    // let adminToken = Jwt.token.generate(
    //  new TestTokenPayload().adminTokenPayload(username, key), 
    //  secret);

    userToken = `Bearer ${userToken}`;
    
    // const testForm = {
    //   username: username,
    //  displayname: username,
    //  password: 'a1A!aaaa',
    // };
    
    // 
    // test is just for testing dont use in production

    const res = await server.inject({
      method: 'get',
      url: `/adopter/${owner}/${id}`,
      headers: {
        authorization: userToken,
        
          debug: false,
          test: JSON.stringify(adopter_data)
        
      }
    });

    // console.log('res GET ', res.result);
    
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    expect(res.result.selection).to.exist();

  });

  

  // ---------------------------------
  // adopter PUT
  // ---------------------------------
  
  test('12 API /adopter/owner/id with payload PUT user_token 200', async () => {

    // Goal: adopter  application user
    // Strategy: 
    // - signup a user, get user id, 
    // - make user token, provide user-token to update
    // - use rollback to get rid of signup          
    // Role: api_user
    // MODEL:function_adopter_put_
    // DB TEST:
    // API TEST: route.integration.test.js 
    // [data]
    const adopter_data = {
      "owners": {
          "duckduckgoose":{
              "username": "admin@user.com",
              "displayname": "A",
              "password": "a1A!aaaa",
              "scope": "api_admin"
           }
      },
      "data": [
          {"pk":"username#putter@user.com", 
          "sk":"const#USER", 
          "tk":"guid#1", 
          "form": {"username":"putter@user.com", "displayname":"J","password":"a1A!aaaa"}, 
          "owner":"duckduckgoose"
         }
      ]
    };
    // [Token values ]
    const username = adopter_data.data[0].form.username; // 'userC@user.com';
    const id = username;
    const key = adopter_data.data[0].owner;

    const secret = process.env.JWT_SECRET;

    // [Two tokens required to run test guestToken and userToken]
    // [User token calculated from test values]
    const userPayload = new UserTokenPayload(
                                         username, 
                                         key)
                                         .payload();
    let userToken  = Jwt.token.generate(userPayload, 
                                        secret);    
    const owner = key;
    // [Admin token...generate]
    // let adminToken = Jwt.token.generate(new TestTokenPayload().adminTokenPayload(username, key), secret);
    
    // let adminToken = Jwt.token.generate(
    //    new AdminTokenPayload(username, key).payload(), 
    //    secret);
    userToken = `Bearer ${userToken}`;
    // [Existing user required to run test]

    // [Any value can be changed]
    const changeForm = {
      username: 'update@user.com',
      displayname: 'U',
      password: 'b1B!bbbb',
    };

    // [Start the test]

    const res = await server.inject({
      method: 'put',
      url: `/adopter/${owner}/${id}`,
      headers: {
        authorization: userToken,

          debug: false,
          test: JSON.stringify(adopter_data),
        
      },
      payload: changeForm
    });

    // console.log('res PUT ', res.result);
    // console.log('res PUT ', res.result.updation.form.scope);
    
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    expect(res.result.updation.form.username).to.equal(changeForm.username);
    expect(res.result.updation.form.displayname).to.equal(changeForm.displayname);

    expect(res.result.updation.form.scope).to.equal('api_user');
  });




// ----------------------------------


  // ---------------------------------
  // adoptee DELETE
  // ---------------------------------
  
  test('3 API /adoptee_del/owner/id DElETE (Owner, Id) api_user, 200', async () => {

    // Goal: delete one specific adoptee by owner 
    // Strategy: Using a user_token, insert dummy adoptee, and then remove it.  
    // Role: api_user
    const adoptee_delete_data = {
      "owners":{
        "duckduckgoose":{
           "username":"adopter@user.com",
           "displayname":"A",
           "password":"a1A!aaaa",
           "scope": "api_user"
        }
      },
      "data": [
        {"pk":"drain_id#one_delete", 
         "sk":"const#ADOPTEE", 
         "tk":"guid#1", 
         "form": {"name":"One", "drain_id":"Onedelete","type":"TestDrain", "lat":1.0, "lon":1.0}, 
         "owner":"duckduckgoose"
        }
      ]
    };
   
    const user = adoptee_delete_data.owners[adoptee_delete_data.data[0].owner].username; 
    const owner = adoptee_delete_data.data[0].owner ;// 'duckduckgoose';
    // const lapse_in_millisec = 5000; // 5 seconds
    
    const payload = new UserTokenPayload(user, 
                                         owner)
                                         .payload();
    
    const secret = process.env.JWT_SECRET;    
    let token = `Bearer ${Jwt.token.generate(payload, secret)}`;
    let id = adoptee_delete_data.data[0].form.drain_id;

    // test is just for testing dont use in production
    const a_url = `/adoptee/${encodeURI(owner)}/${encodeURI(id)}`;

    // const a_url = `/adoptee/${encodeURI(owner)}/${encodeURI(id)}`;
    // console.log('a_url ', a_url);
    const res = await server.inject({
      method: 'delete',
      url: a_url,
      headers: {
        authorization: token,
        
          debug: false,
          test: JSON.stringify(adoptee_delete_data)
      }
    });
    // console.log('TEST API /adoptee DELETE', res.result);

    expect(res.result.status).to.equal('200');
    expect(res.result.deletion).to.exist();
    expect(res.result.deletion).to.not.equal([]);
 
  });
  
  
  // ---------------------------------
  // adoptee GET 
  // Model: function_adoptee_get_toi.js
  // Route: adoptee_route_get.js
  // ---------------------------------
  test('4 API /adoptee/owner/id GET 200', async () => {
    // [Add Test data]
    const data = {
      "owners":{
        "duckduckgoose":{
           "username":"get@user.com",
           "displayname":"A",
           "password":"a1A!aaaa",
           "scope": "api_user"
        }
      },
      "data": [
        {"pk":"drain_id#oneget", 
         "sk":"const#ADOPTEE", 
         "tk":"guid#1", 
         "form": {"name":"One", "drain_id":"Oneget","type":"TestDrain", "lat":1.0, "lon":1.0}, 
         "owner":"duckduckgoose"
        }, 
        {"pk":"drain_id#twoget", 
         "sk":"const#ADOPTEE", 
         "tk":"guid#2", 
         "form": {"name":"Two", "drain_id":"Twoget","type":"TestDrain","lat":1.0, "lon":1.0}, 
         "owner":"duckduckgoose"
        }, 
        {"pk":"drain_id#threeget", 
        "sk":"const#ADOPTEE", 
        "tk":"guid#3", 
        "form": {"name":"Three", "drain_id":"Threeget","type":"TestDrain","lat":1.0, "lon":1.0}, 
        "owner":"duckduckgoose"
       } 
      ]
    };
 
    // [Setup Test Token]

    const key = data.data[0].owner;
    const user = data.owners[key].username; 
    
    const secret = process.env.JWT_SECRET;
     
    const payload = new UserTokenPayload(user, 
                                         key)
                                         .payload();
                                         
    let token = `Bearer ${Jwt.token.generate(payload, secret)}`;
       
    // [Set owner and id]
    const owner = key;  
    const id = data.data[0].form.drain_id;
    // [Inject Test into Server]
 
    const a_url = `/adoptee/${encodeURI(owner)}/${encodeURI(id)}`;

    const res = await server.inject({
      method: 'get',
      url: a_url,
      headers: {
        authorization: token,
        debug: false,
        test: JSON.stringify(data)
      }
    });

    // [Check results]
    // console.log('API /adoptee/owner/id GET results', res.result);

    expect(res.result.status).to.equal('200');
    expect(res.result.selection).to.exist();
    expect(res.result.selection).to.not.equal([]);
  });  
// ---------------------------------
  // adoptee GET 
  // Model: function_adoptee_get_toi.js
  // Route: adoptee_route_get.js
  // ---------------------------------
  test('4 API /adoptee/owner GET 200', async () => {
    // [Add Test data]
    const data = {
      "owners":{
        "duckduckgoose":{
           "username":"get@user.com",
           "displayname":"A",
           "password":"a1A!aaaa",
           "scope": "api_user"
        }
      },
      "data": [
        {"pk":"drain_id#oneget", 
         "sk":"const#ADOPTEE", 
         "tk":"guid#1", 
         "form": {"name":"One", "drain_id":"Oneget","type":"TestDrain", "lat":1.0, "lon":1.0}, 
         "owner":"duckduckgoose"
        }, 
        {"pk":"drain_id#twoget", 
         "sk":"const#ADOPTEE", 
         "tk":"guid#2", 
         "form": {"name":"Two", "drain_id":"Twoget","type":"TestDrain","lat":1.0, "lon":1.0}, 
         "owner":"duckduckgoose"
        }, 
        {"pk":"drain_id#threeget", 
        "sk":"const#ADOPTEE", 
        "tk":"guid#3", 
        "form": {"name":"Three", "drain_id":"Threeget","type":"TestDrain","lat":1.0, "lon":1.0}, 
        "owner":"duckduckgoose"
       } 
      ]
    };
 
    // [Setup Test Token]

    const key = data.data[0].owner;
    const user = data.owners[key].username; 
    
    const secret = process.env.JWT_SECRET;
     
    const payload = new UserTokenPayload(user, 
                                         key)
                                         .payload();
                                         
    let token = `Bearer ${Jwt.token.generate(payload, secret)}`;
       
    // [Set owner and id]
    const owner = key;  
    // const id = data.data[0].form.drain_id;
    // [Inject Test into Server]
 
    const a_url = `/adoptee/${encodeURI(owner)}`;

    const res = await server.inject({
      method: 'get',
      url: a_url,
      headers: {
        authorization: token,
        debug: false,
        test: JSON.stringify(data)
      }
    });

    // [Check results]
    // console.log('API /adoptee/owner/id GET results', res.result);

    expect(res.result.status).to.equal('200');
    expect(res.result.selection).to.exist();
    expect(res.result.selection).to.not.equal([]);
  });  
  // -----------------------------------------
  // adoptee POST
  // -----------------------------------------
  /*
  test('5 API /adoptee POST MBR Guest 200', async () => {

  });  
*/
  // [Test adoptee guest with MBR]
 

  test('6 API /adoptee/mbr POST MBR, api_guest, 200', async () => {
    //  find adoptee in mbr /adoptees to POST  
    const data = {
      "owners":{
        "duckduckgoose":{
           "username":"get@user.com",
           "displayname":"A",
           "password":"a1A!aaaa",
           "scope": "api_user"
        }
      },
      "data": [
        {"pk":"drain_id#oneget", 
         "sk":"const#ADOPTEE", 
         "tk":"guid#1", 
         "form": {"name":"One", "drain_id":"Oneget","type":"TestDrain", "lat":1.0, "lon":1.0}, 
         "owner":"duckduckgoose"
        }, 
        {"pk":"drain_id#twoget", 
         "sk":"const#ADOPTEE", 
         "tk":"guid#2", 
         "form": {"name":"Two", "drain_id":"Twoget","type":"TestDrain","lat":1.0, "lon":1.0}, 
         "owner":"duckduckgoose"
        }, 
        {"pk":"drain_id#threeget", 
        "sk":"const#ADOPTEE", 
        "tk":"guid#3", 
        "form": {"name":"Three", "drain_id":"Threeget","type":"TestDrain","lat":1.0, "lon":1.0}, 
        "owner":"duckduckgoose"
       } 
      ]
    };
     const payload = new GuestTokenPayload().payload();

     const secret = process.env.JWT_SECRET;
     const token = `Bearer ${Jwt.token.generate(payload, secret)}`;
     
     // let form = {"north":4.0, "south":0.0, "west":0.0, "east":4.0};     
     const form = {north:4.0, south:0.0, west:0.0, east:4.0};     
     
     const res = await server.inject({
       method: 'post',
       url: '/adoptee/mbr',
       headers: {
         authorization: token,
         test: JSON.stringify(data)
       },
       payload: form,
     });
     
     // console.log('TEST API /adoptee/mbr MBR POST', res.result);
 
     expect(res.result.status).to.equal('200');
     expect(res.result.selection).to.exist();
     expect(res.result.selection).to.not.equal([]);
 
   });

  test('7 API /adoptee/owner POST payload, api_user, 200', async () => {
   //  change /adoptees to POST  

    const key = 'duckduckgoose'; // adoptee_data.data[0].owner;
    const username = 'adopter@user.com' ; // adoptee_data.owners[key].username;

    const payload = new UserTokenPayload(username, key).payload();

    const secret = process.env.JWT_SECRET;
    let token = Jwt.token.generate(payload, secret);    

    // let form = {"name":"ABC", "drain_id":"ABC","type":"TestDrain","lat":1.0, "lon":1.0};
    let form = {type: 'adoptee', lat: 42.9704549894, lon: -85.6766804204, drain_id: 'CGR_2059902', name: 'zzzz'};
    token = `Bearer ${token}`;

    const res = await server.inject({
      method: 'post',
      url: `/adoptee/${key}`,
      headers: {
        authorization: token,
        accept: "application/json",
        'Content-Type': 'application/json',
        rollback: true
      },
      payload: form,
    });
    
    // console.log('API /adoptee POST', res.result);

    expect(res.result.status).to.equal('200');
    expect(res.result.insertion).to.exist();
    expect(res.result.insertion).to.not.equal([]);

  });
  
  test('8 API /adoptee/owner POST Duplicate payload, api_user, 200', async () => {
    //  change /adoptees to POST  
    const data = {
      "owners":{
        "duckduckgoose":{
           "username":"get@user.com",
           "displayname":"A",
           "password":"a1A!aaaa",
           "scope": "api_user"
        }
      },
      "data": [
        {"pk":"drain_id#onedup", 
         "sk":"const#ADOPTEE", 
         "tk":"guid#1", 
         "form": {"name":"One", "drain_id":"TEST_2059902","type":"TestDrain", "lat":1.0, "lon":1.0}, 
         "owner":"duckduckgoose"
        }
      ]
    };
     const key = 'duckduckgoose'; // adoptee_data.data[0].owner;
     const username = 'adopter@user.com' ; // adoptee_data.owners[key].username;
 
     const payload = new UserTokenPayload(username, key).payload();
 
     const secret = process.env.JWT_SECRET;
     let token = Jwt.token.generate(payload, secret);    
 
     // let form = {"name":"ABC", "drain_id":"ABC","type":"TestDrain","lat":1.0, "lon":1.0};
     let form = {type: 'adoptee', lat: 42.9704549894, lon: -85.6766804204, drain_id: 'TEST_2059902', name: 'zzzz'};
     token = `Bearer ${token}`;
 
     const res = await server.inject({
       method: 'post',
       url: `/adoptee/${key}`,
       headers: {
         authorization: token,
         accept: "application/json",
         'Content-Type': 'application/json',
         rollback: true,
         test: JSON.stringify(data)
       },
       payload: form,
     });
     
     // console.log('API /adoptee POST', res.result);
 
     expect(res.result.status).to.equal('409');
     expect(res.result.insertion).to.not.exist();
 
   });
  // ---------------------------------
  // adoptee PUT
  // write sql: function_adoptee_put_tijo
  // configure test: adoptee-put-toi in settings.json 
  // -- prepare post data in api test
  // write route test: in route.integration.js
  //
  
  test('API /adoptee api_user(TOKEN,OWNER,IDENTITY,JSONB) PUT, 200', async () => {

    // Goal: adoptee
    // Strategy: 
    // - post an adopter, update the adoptee.name, rollback 
    // [data]
    const data = {
      "owners":{
        "duckduckgoose":{
           "username":"get@user.com",
           "displayname":"A",
           "password":"a1A!aaaa",
           "scope": "api_user"
        }
      },
      "data": [
        {"pk":"drain_id#oneput", 
         "sk":"const#ADOPTEE", 
         "tk":"guid#1", 
         "form": {"name":"One", "drain_id":"One_put","type":"TestDrain", "lat":1.0, "lon":1.0}, 
         "owner":"duckduckgoose"
        }
      ]
    };
    // [Token values ]
    
    const key = data.data[0].owner;
    const user = data.owners[key].username; 
    const id = data.data[0].form.drain_id;
    
    const secret = process.env.JWT_SECRET;

    // [User token calculated from test values]

    const owner = key;

    // [User token...generate]
    const payload = new UserTokenPayload(user, key).payload();
    const token = `Bearer ${Jwt.token.generate(payload, secret)}`;

    // [Any value can be changed]
    
    const changeForm = {name:"Two", drain_id:"Two_put",type:"Test-Drain", lat:2.0, lon:2.0};
    // [Start the test]
    const aurl = `/adoptee/${owner}/${id}`;
    const res = await server.inject({
      method: 'put',
      url: aurl,
      headers: {
        authorization: token,
        
        debug: false,
        test: JSON.stringify(data)
      },
      payload: changeForm
    });

    // console.log('res PUT ', res.result);
    // console.log('res PUT ', res.result.updation.form.scope);
    
    expect(res.statusCode).to.equal(200);
    expect(res.result.status).to.equal('200');
    expect(res.result.updation.pk).to.equal('drain_id#Two_put');
    expect(res.result.updation.sk).to.equal('const#ADOPTEE');
    expect(res.result.updation.form).to.equal(changeForm);
    expect(res.result.updation.owner).to.equal('duckduckgoose');

  });

});  