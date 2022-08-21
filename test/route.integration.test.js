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
      }
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
  // adopter POST
  // ---------------------------------
  test('3.1 API /adopter POST user_token, 200', async () => {

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

  test('3.2 API /adopter/owner/id DELETE user_token, 200', async () => {

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
      url: `/adopter/${encodeURI(owner)}/${encodeURI(id)}`,
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

  test('3.3 API /adopter/owner/id GET user_token, 200', async () => {

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
      url: `/adopter/${encodeURI(owner)}/${encodeURI(id)}`,
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

  test('3.4 API /adopter/owner/id with payload PUT user_token 200', async () => {

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
      url: `/adopter/${encodeURI(owner)}/${encodeURI(id)}`,
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

  test('3.5 API /adopter/owner/id DELETE admin_token, 200', async () => {

        // Goal: document  application user
        // Strategy: Insert dummy user, and then remove it.
        // Role: api_user
        const document_data = {
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
            url: `/adopter/${encodeURI(owner)}/${encodeURI(id)}`,
            headers: {
                authorization: token,

                debug: false,
                test: JSON.stringify(document_data)

            }
        });

        // console.log('res DELETE ', res.result);

        expect(res.statusCode).to.equal(200);
        expect(res.result.status).to.equal('200');

        // expect(res.result.token).to.exist();
        // console.log('/document DElETE test out');

    });

  // ---------------------------------
  // adoptee DELETE
  // ---------------------------------

  test('4.1 API /adoptee_del/owner/id DElETE (Owner, Id) api_user, 200', async () => {

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
         "form": {"name":"One", "drain_id":"one_delete","type":"TestDrain", "lat":1.0, "lon":1.0},
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
    // console.log('adoptee_del a_url ', a_url);
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
  test('4.2 API /adoptee/owner/id GET 200', async () => {
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
  test('4.3 API /adoptee/owner GET 200', async () => {
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

  test('4.4 API /adoptee POST MBR Guest 200', async () => {

  });

  // [Test adoptee guest with MBR]


  test('4.5 API /adoptee/mbr POST MBR, api_guest, 200', async () => {
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

  test('4.6 API /adoptee/owner POST payload, api_user, 200', async () => {
   //  change /adoptees to POST

    const key = 'duckduckgoose'; // adoptee_data.data[0].owner;
    const username = 'adopter@user.com' ; // adoptee_data.owners[key].username;

    const payload = new UserTokenPayload(username, key).payload();

    const secret = process.env.JWT_SECRET;
    // [user user token]
    let token = Jwt.token.generate(payload, secret);

    let form = {type: 'adoptee', lat: 42.9704549894, lon: -85.6766804204, drain_id: 'CGR_2059902', name: 'zzzz'};
    token = `Bearer ${token}`;

    const res = await server.inject({
      method: 'post',
      url: `/adoptee/${encodeURI(key)}`,
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

  test('4.7 API /adoptee/owner POST Duplicate payload, api_user, 200', async () => {
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
        {"pk":"drain_id#TEST_2059902",
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
       url: `/adoptee/${encodeURI(key)}`,
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

  test('4.8 API /adoptee PUT api_user(TOKEN,OWNER,IDENTITY,JSONB), 200', async () => {

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
         "form": {"name":"One", "drain_id":"Oneput","type":"TestDrain", "lat":1.0, "lon":1.0},
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
    const aurl = `/adoptee/${encodeURI(owner)}/${encodeURI(id)}`;
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

      // ---------------------------------
      // document DELETE
      // ---------------------------------


        // ---------------------------------
        // document GET
        // ---------------------------------
        // [Add Test data]
        // [Setup Test Token]
        // [Inject Test into Server]
        // [Check results]

    test('5.1 API /document/0/id GET guest_token, 200', async () => {

          // Goal: document
          // Strategy: add test document, get document, rollback db
          // Role:
          const document_data = {
            "owners": {
                "duckduckgoose":{
                    "username": "joeadmin@user.com",
                    "displayname": "A",
                    "password": "a1A!aaaa",
                    "scope": "api_admin"
                 }
            },
            "data": [
              {
                  "pk": "id#toutest",
                  "sk": "name#00000.00000",
                  "tk": "value#Terms",
                  "form": {"id":"toutest", "name":"00000.00000", "value": "Terms"},
                  "owner": "duckduckgoose"
              },
                {
                    "pk": "id#toutest",
                    "sk": "name#00000.00001",
                    "tk": "value#of",
                    "form": {"id":"toutest","name":"00000.00001","value": "of"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "id#toutest",
                    "sk": "name#00000.00002",
                    "tk": "value#Use",
                    "form": {"id":"toutest","name":"00000.00002","value": "Use"},
                    "owner": "duckduckgoose"
                },

              {
                  "pk": "id#toutest",
                  "sk": "name#00001.00000",
                  "tk": "value#TOU",
                  "form": {"id":"toutest","name": "00001.00000","value": "TOU"},
                  "owner": "duckduckgoose"
              },
              {
                  "pk": "id#toutest",
                  "sk": "name#00002.00000",
                  "tk": "value##",
                  "form": {"id":"toutest", "name":"00002.00000","value": "#"},
                  "owner": "duckduckgoose"
              },
              {
                  "pk": "id#toutest",
                  "sk": "name#00002.00001",
                  "tk": "value#Terms",
                  "form": {"id":"toutest", "name":"00002.00001", "value": "Terms"},
                  "owner": "duckduckgoose"
              }
            ]
          };

          const id = 'toutest';
          const secret = process.env.JWT_SECRET;
          const payload = new GuestTokenPayload().payload();
          const owner = payload.key;

          let token = Jwt.token.generate(payload, secret);

          const guest_token = `Bearer ${token}`;

          // console.log('/document/0/id GET secret ', secret);
          // console.log('/document/0/id GET payload ',payload);
          // console.log('/document/0/id GET owner ',owner);
          // console.log(`/document/${owner}/${id}`);
          // --------------------------

          // test is just for testing dont use in production

          const res = await server.inject({
            method: 'get',
            url: `/document/${encodeURI(owner)}/${encodeURI(id)}`,
            headers: {
              authorization: guest_token,
                debug: false,
                test: JSON.stringify(document_data)
            }
          });

          // console.log('res GET ', res.result);

          expect(res.statusCode).to.equal(200);
          expect(res.result.status).to.equal('200');
          expect(res.result.selection).to.exist();

        });

      // ---------------------------------
      // document POST
      // ---------------------------------

    test('5.2 API /document/0 POST admin_token, 200', async () => {

        // Goal: add a public document
        // Strategy: only admin can post using document
        // post a public document as an admin
        const username = 'admin@user.com';
        const key = 'duckduckgoose';
        // const aid = 'tou';

        const payload = new AdminTokenPayload(username,
                                             key)
                                             .payload();
        const secret = process.env.JWT_SECRET;
        // [use admin token]
        const token = `Bearer ${Jwt.token.generate(payload, secret)}`;

        // test is just for testing dont use in production
        const a_url = `/document`;
    // console.log('a_url ', a_url);
    // console.log('payload ', payload);
    // console.log('secret ', secret);
    // console.log('token ',token);
        const res = await server.inject({
          method: 'post',
          url: a_url,
          headers: {
            authorization: token,
            accept: "application/json",
            'Content-Type': 'application/json',
            rollback: true,
            owner: key
          },
          payload: {
            "id":"tou",
            "name":"00000.00000",
            "value": "Terms"
          },
        });

        // console.log('res POST ', res.result);

        expect(res.statusCode).to.equal(200);
        expect(res.result.status).to.equal('200');
        // doesnt return a token... use signin for that
        expect(res.result.insertion).to.exist();

      });

    // ---------------------------------
    // Page DELETE all parts of a page
    // ---------------------------------
    // all page items
    // lib/routes/page_route_delete

    test('6.DELETE.1 API /page/owner/PK/pk DElETE (Owner, PrimaryKey) api_admin, 200', async () => {

        // Goal: delete one page by owner and primarykey
        // Strategy: Using a user_token, insert dummy adoptee, and then remove it.
        // Role: api_admin
        const page_delete_data = {
            "owners":{
                "duckduckgoose":{
                    "username":"adopter@user.com",
                    "displayname":"A",
                    "password":"a1A!aaaa",
                    "scope": "api_admin"
                }
            },
            "data": [
                {
                    "pk": "page#testpage",
                    "sk": "name#title",
                    "tk": "value#test-page",
                    "form": {"id":"testpage", "name":"title", "value": "Test-Page"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#subtitle",
                    "tk": "value#test-test-test",
                    "form": {"id":"testpage", "name":"subtitle", "value": "test-test-test"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#description",
                    "tk": "value#once-upon-a-time",
                    "form": {"id":"testpage", "name":"description", "value": "Once-upon-a-time"},
                    "owner": "duckduckgoose"
                }
            ]
        };

        const user = page_delete_data.owners[page_delete_data.data[0].owner].username;
        const owner = page_delete_data.data[0].owner ; // 'duckduckgoose';
        // const lapse_in_millisec = 5000; // 5 seconds

        const payload = new AdminTokenPayload(user,
            owner)
            .payload();

        const secret = process.env.JWT_SECRET;
        let token = `Bearer ${Jwt.token.generate(payload, secret)}`;
        // let id = page_delete_data.data[0].form.drain_id;
        // let id = `PK(${page_delete_data.data[0].form.id},*)`;
        let id = page_delete_data.data[0].form.id;

        // test is just for testing dont use in production
        const a_url = `/page/${encodeURI(owner)}/PK/${encodeURI(id)}`;
        // console.log('page delete a_url ', a_url);

        // e.g., {id: "page#<page-name>", name: "title", value: "<string>|<number>|<boolean>"}
        const res = await server.inject({
            method: 'delete',
            url: a_url,
            headers: {
                authorization: token,
                debug: false,
                test: JSON.stringify(page_delete_data)
            }
        });
        // console.log('TEST Result /page/<owner>/PK/<pk> DELETE', res.result);

        expect(res.result.status).to.equal('200');
        expect(res.result.deletion).to.exist();
        expect(res.result.deletion.count).to.equal(3);

    });

    // ---------------------------------
    // Page DELETE all parts of a page
    // ---------------------------------
    // singleton
    // lib/routes/page_route_delete

    test('6.DELETE.2 API /page/owner/PK/pk/* DElETE (Owner, PrimaryKey) api_admin, 200', async () => {

        // Goal: delete one page part by owner and primarykey
        // Strategy: Using a user_token, insert dummy adoptee, and then remove it.
        // Role: api_admin
        const page_delete_data = {
            "owners":{
                "duckduckgoose":{
                    "username":"adopter@user.com",
                    "displayname":"A",
                    "password":"a1A!aaaa",
                    "scope": "api_admin"
                }
            },
            "data": [
                {
                    "pk": "page#testpage",
                    "sk": "name#title",
                    "tk": "value#test-page",
                    "form": {"id":"testpage", "name":"title", "value": "Test-Page"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#subtitle",
                    "tk": "value#test-test-test",
                    "form": {"id":"testpage", "name":"subtitle", "value": "test-test-test"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#description",
                    "tk": "value#once-upon-a-time",
                    "form": {"id":"testpage", "name":"description", "value": "Once-upon-a-time"},
                    "owner": "duckduckgoose"
                }
            ]
        };

        const user = page_delete_data.owners[page_delete_data.data[0].owner].username;
        const owner = page_delete_data.data[0].owner ; // 'duckduckgoose';
        // const lapse_in_millisec = 5000; // 5 seconds

        const payload = new AdminTokenPayload(user,
            owner)
            .payload();

        const secret = process.env.JWT_SECRET;
        let token = `Bearer ${Jwt.token.generate(payload, secret)}`;

        let pk = page_delete_data.data[0].form.id;
        let sk = page_delete_data.data[0].form.name;

        // test is just for testing dont use in production
        const a_url = `/page/${encodeURIComponent(owner)}/PK/${encodeURIComponent(pk)}/${encodeURIComponent(sk)}`;
        // console.log('page delete a_url ', a_url);

        const res = await server.inject({
            method: 'delete',
            url: a_url,
            headers: {
                authorization: token,
                debug: false,
                test: JSON.stringify(page_delete_data)
            }
        });
        // console.log('TEST API /page/<owner>/PK/<pk> DELETE', res.result);
        // console.log('TEST API /page/<owner>/PK/<pk>/<sk> DELETE', res.result);

        expect(res.result.status).to.equal('200');
        expect(res.result.deletion).to.exist();
        expect(res.result.deletion.count).to.equal(1);

    });

    // ---------------------------------
    // Page DELETE all parts of a page
    // ---------------------------------
    // singleton
    // lib/routes/page_route_delete

    test('6.DELETE.3 API /page/owner/PK/pk/* DElETE Bad Requestapi_admin, 200', async () => {

        // Goal: delete one page part by owner and primarykey
        // Strategy: Using a user_token, insert dummy adoptee, and then remove it.
        // Role: api_admin
        const page_delete_data = {
            "owners":{
                "duckduckgoose":{
                    "username":"adopter@user.com",
                    "displayname":"A",
                    "password":"a1A!aaaa",
                    "scope": "api_admin"
                }
            },
            "data": [
                {
                    "pk": "page#testpage",
                    "sk": "name#title",
                    "tk": "value#test-page",
                    "form": {"id":"testpage", "name":"title", "value": "Test-Page"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#subtitle",
                    "tk": "value#test-test-test",
                    "form": {"id":"testpage", "name":"subtitle", "value": "test-test-test"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#description",
                    "tk": "value#once-upon-a-time",
                    "form": {"id":"testpage", "name":"description", "value": "Once-upon-a-time"},
                    "owner": "duckduckgoose"
                }
            ]
        };

        const user = page_delete_data.owners[page_delete_data.data[0].owner].username;
        const owner = page_delete_data.data[0].owner ; // 'duckduckgoose';
        // const lapse_in_millisec = 5000; // 5 seconds

        const payload = new AdminTokenPayload(user,
            owner)
            .payload();

        const secret = process.env.JWT_SECRET;
        let token = `Bearer ${Jwt.token.generate(payload, secret)}`;

        let pk = 'badpk'; // page_delete_data.data[0].form.id;
        let sk = 'badsk'; // page_delete_data.data[0].form.name;

        // test is just for testing dont use in production
        const a_url = `/page/${encodeURIComponent(owner)}/PK/${encodeURIComponent(pk)}/${encodeURIComponent(sk)}`;
        // console.log('page delete a_url ', a_url);

        const res = await server.inject({
            method: 'delete',
            url: a_url,
            headers: {
                authorization: token,
                debug: false,
                test: JSON.stringify(page_delete_data)
            }
        });
        // console.log('TEST API /page/<owner>/PK/<pk> DELETE', res.result);
        // console.log('TEST API /page/<owner>/PK/<pk>/<sk> DELETE', res.result);

        expect(res.result.status).to.equal('200');
        expect(res.result.deletion).to.exist();
        expect(res.result.deletion.count).to.equal(0); // bad request return zero

    });

    // ---------------------------------
    // Page GET Page as Admin
    // ---------------------------------
    // return all for admin
    // lib/routes/page_route_get

    test('6.GET.1 API /page/owner/PK/pk/* GET (Owner, PrmaryKey) api_admin, 200', async () => {

        // Goal: delete one page by owner and primarykey
        // Strategy:
        // Role: api_admin
        const page_get_data = {
            "owners":{
                "duckduckgoose":{
                    "username":"adopter@user.com",
                    "displayname":"A",
                    "password":"a1A!aaaa",
                    "scope": "api_admin"
                }
            },
            "data": [
                {
                    "pk": "page#testpage",
                    "sk": "name#title",
                    "tk": "value#test-page",
                    "form": {"id":"testpage", "name":"title", "value": "Test-Page"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#subtitle",
                    "tk": "value#test-test-test",
                    "form": {"id":"testpage", "name":"subtitle", "value": "test-test-test"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#description",
                    "tk": "value#once-upon-a-time",
                    "form": {"id":"testpage", "name":"description", "value": "Once-upon-a-time"},
                    "owner": "duckduckgoose"
                }
            ]
        };

        const user = page_get_data.owners[page_get_data.data[0].owner].username;
        const owner = page_get_data.data[0].owner ;// 'duckduckgoose';
        // const lapse_in_millisec = 5000; // 5 seconds

        const payload = new AdminTokenPayload(user,
            owner)
            .payload();

        // console.log('payload ', payload);

        const secret = process.env.JWT_SECRET;
        let token = `Bearer ${Jwt.token.generate(payload, secret)}`;

        let id =  page_get_data.data[0].form.id;
        // test is just for testing dont use in production
        const a_url = `/page/${encodeURI(owner)}/PK/${encodeURI(id)}`;

        // console.log('page get a_url ', a_url);

        const res = await server.inject({
            method: 'get',
            url: a_url,
            headers: {
                authorization: token,
                debug: false,
                test: JSON.stringify(page_get_data)
            }
        });
        // console.log('TEST API /page/<owner>/PK/<pk> GET', res.result);

        expect(res.result.status).to.equal('200');
        expect(res.result.selection).to.exist();
        expect(res.result.selection).to.not.equal([]);
        expect(res.result.selection.length).to.equal(3);
    });

    // ---------------------------------
    // Page GET Page as Guest
    // ---------------------------------
    // return all for guest
    // lib/routes/page_route_get

    test('6.GET.2 API /page/owner/PK/pk/* GET (Owner, PrmaryKey) api_guest, 200', async () => {

        // Goal: delete one page by owner and primarykey
        // Strategy: Using a user_token, insert dummy adoptee, and then remove it.
        // Role: api_admin
        const page_get_data = {
            "owners":{
                "duckduckgoose":{
                    "username":"adopter@user.com",
                    "displayname":"A",
                    "password":"a1A!aaaa",
                    "scope": "api_admin"
                }
            },
            "data": [
                {
                    "pk": "page#testpage",
                    "sk": "name#title",
                    "tk": "value#test-page",
                    "form": {"id":"testpage", "name":"title", "value": "Test-Page"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#subtitle",
                    "tk": "value#test-test-test",
                    "form": {"id":"testpage", "name":"subtitle", "value": "test-test-test"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#description",
                    "tk": "value#once-upon-a-time",
                    "form": {"id":"testpage", "name":"description", "value": "Once-upon-a-time"},
                    "owner": "duckduckgoose"
                }
            ]
        };

        // const user = page_get_data.owners[page_get_data.data[0].owner].username;
        // const owner = page_get_data.data[0].owner ;// 'duckduckgoose';
        // const lapse_in_millisec = 5000; // 5 seconds

        // const payload = new AdminTokenPayload(user,
        //     owner)
        //     .payload();
        const payload = new GuestTokenPayload().payload();
        const secret = process.env.JWT_SECRET;
        let token = `Bearer ${Jwt.token.generate(payload, secret)}`;
        // console.log('Page owner ', payload);
        const owner = payload.key; // page_get_data.data[0].owner ;// 'duckduckgoose';

        let id =  page_get_data.data[0].form.id;

        // test is just for testing dont use in production
        const a_url = `/page/${encodeURI(owner)}/PK/${encodeURI(id)}`;

        // console.log('page get a_url ', a_url);

        const res = await server.inject({
            method: 'get',
            url: a_url,
            headers: {
                authorization: token,
                debug: false,
                test: JSON.stringify(page_get_data)
            }
        });
        // console.log('TEST API /page/<owner>/PK/<pk> GET', res.result);

        expect(res.result.status).to.equal('200');
        expect(res.result.selection).to.exist();
        expect(res.result.selection).to.not.equal([]);
        expect(res.result.selection.length).to.equal(3);

    });

    // ---------------------------------
    // Page GET Page as User
    // ---------------------------------
    // return all for user
    // lib/routes/page_route_get

    test('6.GET.3 API /page/owner/PK/pk/* GET (Owner, PrmaryKey) api_user, 200', async () => {

        // Goal: delete one page by owner and primarykey
        // Strategy: Using a user_token, insert dummy adoptee, and then remove it.
        // Role: api_user

        const page_get_data = {
            "owners":{
                "duckduckgoose":{
                    "username":"adopter@user.com",
                    "displayname":"A",
                    "password":"a1A!aaaa",
                    "scope": "api_admin"
                }
            },
            "data": [
                {
                    "pk": "page#testpage",
                    "sk": "name#title",
                    "tk": "value#test-page",
                    "form": {"id":"testpage", "name":"title", "value": "Test-Page"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#subtitle",
                    "tk": "value#test-test-test",
                    "form": {"id":"testpage", "name":"subtitle", "value": "test-test-test"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#description",
                    "tk": "value#once-upon-a-time",
                    "form": {"id":"testpage", "name":"description", "value": "Once-upon-a-time"},
                    "owner": "duckduckgoose"
                }
            ]
        };

        const user = page_get_data.owners[page_get_data.data[0].owner].username;
        const owner = '0'; // user_token can be used but owner must be guest // 'duckduckgoose';
        // const lapse_in_millisec = 5000; // 5 seconds

        // const payload = new AdminTokenPayload(user,owner).payload();
        const payload = new UserTokenPayload(user, owner).payload();
        // console.log('payload ', payload);
        const secret = process.env.JWT_SECRET;
        let token = `Bearer ${Jwt.token.generate(payload, secret)}`;
        let id =  page_get_data.data[0].form.id;
        // test is just for testing dont use in production
        const a_url = `/page/${encodeURI(owner)}/PK/${encodeURI(id)}`;

        // console.log('page get a_url ', a_url);

        const res = await server.inject({
            method: 'get',
            url: a_url,
            headers: {
                authorization: token,
                debug: false,
                test: JSON.stringify(page_get_data)
            }
        });
        // console.log('TEST API /page/<owner>/PK/<pk> GET', res.result);

        expect(res.result.status).to.equal('200');
        expect(res.result.selection).to.exist();
        expect(res.result.selection).to.not.equal([]);
        expect(res.result.selection.length).to.equal(3);

    });

    // ---------------------------------
    // Page GET Page as User
    // ---------------------------------
    // return singleton
    // lib/routes/page_route_get

    test('6.GET.4 API /page/owner/PK/pk/sk GET (Owner, PrmaryKey) api_admin, 200', async () => {

        // Goal: delete one page by owner and primarykey
        // Strategy: Using a user_token, insert dummy adoptee, and then remove it.
        // Role: api_admin
        const page_get_data = {
            "owners":{
                "duckduckgoose":{
                    "username":"adopter@user.com",
                    "displayname":"A",
                    "password":"a1A!aaaa",
                    "scope": "api_admin"
                }
            },
            "data": [
                {
                    "pk": "page#testpage",
                    "sk": "name#title",
                    "tk": "value#test-page",
                    "form": {"id":"testpage", "name":"title", "value": "Test-Page"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#subtitle",
                    "tk": "value#test-test-test",
                    "form": {"id":"testpage", "name":"subtitle", "value": "test-test-test"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#description",
                    "tk": "value#once-upon-a-time",
                    "form": {"id":"testpage", "name":"description", "value": "Once-upon-a-time"},
                    "owner": "duckduckgoose"
                }
            ]
        };

        const user = page_get_data.owners[page_get_data.data[0].owner].username;
        const owner = page_get_data.data[0].owner ;// 'duckduckgoose';
        // const lapse_in_millisec = 5000; // 5 seconds

        const payload = new AdminTokenPayload(user,owner).payload();
        // const payload = new UserTokenPayload(user, owner).payload();

        const secret = process.env.JWT_SECRET;
        let token = `Bearer ${Jwt.token.generate(payload, secret)}`;

        let pk =  page_get_data.data[0].form.id;
        let sk =  page_get_data.data[0].form.name;

        // test is just for testing dont use in production
        const a_url = `/page/${encodeURIComponent(owner)}/PK/${encodeURIComponent(pk)}/${encodeURIComponent(sk)}`;

        // console.log('page get a_url ', a_url);

        const res = await server.inject({
            method: 'get',
            url: a_url,
            headers: {
                authorization: token,
                debug: false,
                test: JSON.stringify(page_get_data)
            }
        });
        // console.log('TEST API /page/<owner>/PK/<pk> GET', res.result);

        expect(res.result.status).to.equal('200');
        expect(res.result.selection).to.exist();
        expect(res.result.selection).to.not.equal([]);
        expect(res.result.selection.length).to.equal(1);

    });


    // ---------------------------------
    // Page Post admin
    // ---------------------------------
    // admin
    // lib/routes/page_part_route_post

    test('6.POST.1   API /page/owner title POST, api_admin, 200', async () => {
        //  change /pages to POST

        const owner = 'duckduckgoose';
        const username = 'adopter@user.com';

        const payload = new AdminTokenPayload(username, owner).payload();

        const secret = process.env.JWT_SECRET;
        let token = Jwt.token.generate(payload, secret);

        let form = {"id":"testpage", "name":"title", "value": "Test-Page"};

        token = `Bearer ${token}`;

        const res = await server.inject({
            method: 'post',
            url: `/page/${encodeURIComponent(owner)}`,
            headers: {
                authorization: token,
                accept: "application/json",
                'Content-Type': 'application/json',
                rollback: true
            },
            payload: form,
        });

        // console.log('response API /page POST', res.result);

        expect(res.result.status).to.equal('200');
        expect(res.result.insertion).to.exist();
        expect(res.result.insertion).to.not.equal([]);

    });

    test('6.POST.2   API /page/owner subtitle POST, api_admin, 200', async () => {
        //  change /pages to POST

        const owner = 'duckduckgoose';
        const username = 'adopter@user.com';

        const payload = new AdminTokenPayload(username, owner).payload();

        const secret = process.env.JWT_SECRET;
        let token = Jwt.token.generate(payload, secret);

        let form = {"id":"testpage", "name":"subtitle", "value": "Test-Page"};

        token = `Bearer ${token}`;

        const res = await server.inject({
            method: 'post',
            url: `/page/${encodeURIComponent(owner)}`,
            headers: {
                authorization: token,
                accept: "application/json",
                'Content-Type': 'application/json',
                rollback: true
            },
            payload: form,
        });

        // console.log('response API /page POST', res.result);

        expect(res.result.status).to.equal('200');
        expect(res.result.insertion).to.exist();
        expect(res.result.insertion).to.not.equal([]);

    });

    // ---------------------------------
    // Page PUT Title
    // ---------------------------------
    // lib/routes/page_route_put

    test('6.PUT.1 API /page/owner/PK/pk/sk title PUT api_admin, 200', async () => {

            // Goal: page
            // Strategy:
            // - post a page, then update the page.value, rollback
            // [data]
            // console.log('page PUT 1');
            const data = {
                "owners":{
                    "duckduckgoose":{
                        "username":"adopter@user.com",
                        "displayname":"A",
                        "password":"a1A!aaaa",
                        "scope": "api_admin"
                    }
                },
                "data": [
                    {
                        "pk": "page#testpage",
                        "sk": "name#title",
                        "tk": "value#test-page",
                        "form": {"id":"testpage", "name":"title", "value": "Test-Page"},
                        "owner": "duckduckgoose"
                    },
                    {
                        "pk": "page#testpage",
                        "sk": "name#subtitle",
                        "tk": "value#test-test-test",
                        "form": {"id":"testpage", "name":"subtitle", "value": "test-test-test"},
                        "owner": "duckduckgoose"
                    },
                    {
                        "pk": "page#testpage",
                        "sk": "name#description",
                        "tk": "value#once-upon-a-test",
                        "form": {"id":"testpage", "name":"description", "value": "Once-upon-a-test"},
                        "owner": "duckduckgoose"
                    }
                ]
            };
            // [Token values ]
            const key = data.data[0].owner;
            const user = data.owners[key].username;
            // const id = data.data[0].form.id;

            const secret = process.env.JWT_SECRET;

            // [User token calculated from test values]

            const owner = key;

            // [User token...generate]
            const payload = new AdminTokenPayload(user, key).payload();
            const token = `Bearer ${Jwt.token.generate(payload, secret)}`;
            // console.log('token ', token);
            // [Any value can be changed]
            // const pk = data.data[0].pk;
            // const sk = data.data[0].sk;
            const pk = data.data[0].pk.replace('page#','');
            const sk = data.data[0].sk.replace('name#', '');
            const changeForm = {"id":"testpage", "name":"title", "value": "title-change"};
            // [Start the test]
            const aurl = `/page/${encodeURIComponent(owner)}/PK/${encodeURIComponent(pk)}/${encodeURIComponent(sk)}`;
            // console.log('page PUT aurl ', aurl);
            // console.log('page PUT form ', changeForm);
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

            // console.log('page PUT res ', res.result);
            // console.log('res PUT ', res.result.updation.form.scope);

            expect(res.statusCode).to.equal(200);
            expect(res.result.status).to.equal('200');
            expect(res.result.updation.pk).to.equal('page#testpage');
            expect(res.result.updation.sk).to.equal('name#title');
            expect(res.result.updation.tk).to.equal('value#title-change');

            expect(res.result.updation.form).to.equal(changeForm);
            // expect(res.result.updation.owner).to.equal('duckduckgoose');

        });


    // ---------------------------------
    // Page PUT SubTitle
    // ---------------------------------
    // lib/routes/page_route_put


    test('6.PUT.1 API /page/owner/PK/pk/sk subtitle PUT api_admin, 200', async () => {

        // Goal: page
        // Strategy:
        // - post a page, then update the page.value, rollback
        // [data]
        // console.log('page PUT 1');
        const data = {
            "owners":{
                "duckduckgoose":{
                    "username":"adopter@user.com",
                    "displayname":"A",
                    "password":"a1A!aaaa",
                    "scope": "api_admin"
                }
            },
            "data": [
                {
                    "pk": "page#testpage",
                    "sk": "name#title",
                    "tk": "value#test-page",
                    "form": {"id":"testpage", "name":"title", "value": "Test-Page"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#subtitle",
                    "tk": "value#test-test-test",
                    "form": {"id":"testpage", "name":"subtitle", "value": "test-test-test"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#description",
                    "tk": "value#once-upon-a-test",
                    "form": {"id":"testpage", "name":"description", "value": "Once-upon-a-test"},
                    "owner": "duckduckgoose"
                }
            ]
        };
        // [Token values ]
        const key = data.data[0].owner;
        const user = data.owners[key].username;
        // const id = data.data[0].form.id;

        const secret = process.env.JWT_SECRET;

        // [User token calculated from test values]

        const owner = key;

        // [User token...generate]
        const payload = new AdminTokenPayload(user, key).payload();
        const token = `Bearer ${Jwt.token.generate(payload, secret)}`;
        // console.log('token ', token);
        // [Any value can be changed]

        const pk = data.data[1].pk.replace('page#','');
        const sk = data.data[1].sk.replace('name#', '');
        const changeForm = {"id":"testpage", "name":"subtitle", "value": "subtitle-change"};
        // [Start the test]
        const aurl = `/page/${encodeURIComponent(owner)}/PK/${encodeURIComponent(pk)}/${encodeURIComponent(sk)}`;
        // console.log('page PUT aurl ', aurl);
        // console.log('page PUT form ', changeForm);
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

        // console.log('page PUT res ', res.result);
        // console.log('res PUT ', res.result.updation.form.scope);

        expect(res.statusCode).to.equal(200);
        expect(res.result.status).to.equal('200');
        expect(res.result.updation.pk).to.equal('page#testpage');
        expect(res.result.updation.sk).to.equal('name#subtitle');
        expect(res.result.updation.tk).to.equal('value#subtitle-change');

        expect(res.result.updation.form).to.equal(changeForm);
        // expect(res.result.updation.owner).to.equal('duckduckgoose');

    });

// ---------------------------------
    // Page PUT SubTitle
    // ---------------------------------
    // lib/routes/page_route_put


    test('6.PUT.1 API /page/owner/PK/pk/sk pk, sk, title, and subtitle PUT api_admin, 200', async () => {

        // Goal: page
        // Strategy:
        // - post a page, then update the page.value, rollback
        // [data]
        // console.log('page PUT 1');
        const data = {
            "owners":{
                "duckduckgoose":{
                    "username":"adopter@user.com",
                    "displayname":"A",
                    "password":"a1A!aaaa",
                    "scope": "api_admin"
                }
            },
            "data": [
                {
                    "pk": "page#testpage",
                    "sk": "name#title",
                    "tk": "value#test-page",
                    "form": {"id":"testpage", "name":"title", "value": "Test-Page"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#subtitle",
                    "tk": "value#test-test-test",
                    "form": {"id":"testpage", "name":"subtitle", "value": "test-test-test"},
                    "owner": "duckduckgoose"
                },
                {
                    "pk": "page#testpage",
                    "sk": "name#description",
                    "tk": "value#once-upon-a-test",
                    "form": {"id":"testpage", "name":"description", "value": "Once-upon-a-test"},
                    "owner": "duckduckgoose"
                }
            ]
        };
        // [Token values ]
        const key = data.data[0].owner;
        const user = data.owners[key].username;
        // const id = data.data[0].form.id;

        const secret = process.env.JWT_SECRET;

        // [User token calculated from test values]

        const owner = key;

        // [User token...generate]
        const payload = new AdminTokenPayload(user, key).payload();
        const token = `Bearer ${Jwt.token.generate(payload, secret)}`;
        // console.log('token ', token);
        // [Any value can be changed]

        const pk = data.data[1].pk.replace('page#','');
        const sk = data.data[1].sk.replace('name#', '');
        const changeForm = {"id":"testpagex", "name":"subtitlex", "value": "subtitle-x"};
        // [Start the test]
        const aurl = `/page/${encodeURIComponent(owner)}/PK/${encodeURIComponent(pk)}/${encodeURIComponent(sk)}`;
        // console.log('page PUT aurl ', aurl);
        // console.log('page PUT form ', changeForm);
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

        // console.log('page PUT res ', res.result);
        // console.log('res PUT ', res.result.updation.form.scope);

        expect(res.statusCode).to.equal(200);
        expect(res.result.status).to.equal('200');
        expect(res.result.updation.pk).to.equal('page#testpagex');
        expect(res.result.updation.sk).to.equal('name#subtitlex');
        expect(res.result.updation.tk).to.equal('value#subtitle-x');

        expect(res.result.updation.form).to.equal(changeForm);
        // expect(res.result.updation.owner).to.equal('duckduckgoose');

    });

});


