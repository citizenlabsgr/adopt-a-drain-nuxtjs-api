'use strict';
/* eslint-disable dot-notation */
/* eslint-disable no-console */
/* eslint-disable no-multi-assign */

// This test has trouble connecting to database
// test manually with swagger

const Jwt = require('@hapi/jwt');
// const Settings = require('../lib/settings.js');
// es lint-disable-next-line import/no-extraneous-dependencies
const Lab = require('@hapi/lab');
const { describe, it } = exports.lab = Lab.script();

// es lint-disable-next-line import/no-extraneous-dependencies
const { expect } = require('@hapi/code');

// const { init } = require('../lib/server');

// const TestTokenPayload = require('../lib/util/token_payload_test');
const UserTokenPayload = require('../lib/auth/token_payload_user');

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

describe('Token Tests', () => {
  /*
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
  */
  // -----------------------------------------
  // userToken
  // -----------------------------------------
  
  it('API User Token ', async () => {
    //  change /adoptees to POST  
     // const payload = new TestTokenPayload().userTokenPayload();
     const key = adoptee_post_data.data[0].owner;
     const username = adoptee_post_data.owners[key].username;
     const lapse_in_millisec=5000;
     const scope = 'api_user';
     const payload = new UserTokenPayload(username, key, scope, lapse_in_millisec).payload();
     const secret = process.env.JWT_SECRET;
     const token = Jwt.token.generate(payload, secret);
     const artifacts = Jwt.token.decode(token);
     
     expect(artifacts.decoded).to.equal({
       header: { alg: 'HS256', typ: 'JWT'},
       payload: { aud: 'citizenlabs-api',
                   iss: 'citizenlabs',
                   sub: 'client-api',
                   user: 'adopter@user.com',
                   scope: 'api_user',
                   key: 'duckduckgoose',
                   exp: artifacts.decoded.payload.exp,
                   iat: artifacts.decoded.payload.iat 
       },
       signature: artifacts.decoded.signature
     });
 
   });   
  

});
