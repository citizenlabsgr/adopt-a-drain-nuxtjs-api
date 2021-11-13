'use strict';
const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');
const Jwt = require('@hapi/jwt');
const UserTokenPayload = require('../auth/token_payload_user');
// const TestHelper = require('./util/route_test_helper');

// [Route: adopter]
// [Description: post changes to adopter (no password)]
// [Role: api_user, api_admin]
// [Header: token]
// [Header: rollback , default is false]

// const ChelateUser = require('../../lib/chelates/chelate_user.js');

/*
Get adopter
* requires a user-token
* payload must contain {pk:"", sk:"", ...} or  {sk:"", tk:"", ...}
* payload must contain a {...,"form": {...}} key
*/
module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: ['DELETE'],
  path: '/adopter/{id}',
  handler: async function (req) {
    /* $lab:coverage:off$ */
    
    // [Define a /adopter GET route handler]    
    let result = {status:"200", msg:"OK"};
    let client = req.pg || false;
    let token = req.headers.authorization || false; 
    let options = req.headers.api_options || false;
    let apiDebug = options.debug || false;
    let apiTest = options.test || false;
    let owner = req.headers.owner || false;

    // [Fix the token]
    token = `("${token.replace('Bearer ','')}")`;
    owner = `("${owner.replace('Bearer ','')}")`;
    // [Get Parameters]    
    try {
      // [Optionally insert a test user when test in header.options]
      if (apiTest) {
        let post_token = options.token || false; 
        post_token = `("${post_token}")`;
        // [Inititate a transation when test is invoked]
        await client.query('BEGIN');

        // [Insert a user when test is invoked]
        const resA = await client.query(
          {
            text: 'select * from api_0_0_1.adopter($1::TOKEN,$2::JSON,$3::OWNER_ID)',
            values: [post_token,
                    JSON.stringify(apiTest),
                    owner]
          }
        );
        if (!resA) {
          throw new Error("Test failed");
        }  
        // console.log('  TEST DELETE adopter, add user for test resA', resA.rows[0]);

        // [User token needed to delete user/adopter]

        token = Jwt.token.generate(new UserTokenPayload(
          resA.rows[0].adopter.insertion.form.username, 
          resA.rows[0].adopter.insertion.owner, 
          'api_user', 
          5000).payload(), 
          process.env.JWT_SECRET);
        
        token = `("${token}")`;  
      }
    } catch(err) {
      await client.query('ROLLBACK');
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adopter DELETE TEST (TOKEN, VARCHAR, OWNER_ID) err', err);
    }
    try {

      // [ Delete User from the database]
      await client.query('BEGIN');
      let queryObj;
      const id = req.params.id;
      queryObj = {
        text: 'select * from api_0_0_1.adopter($1::TOKEN,$2::VARCHAR,$3::OWNER_ID)',
        values: [token,
                 id,
                 owner]
      };

      let res = await client.query(queryObj);

      result = res.rows[0].adopter;

      if (apiTest) {
        // rollback for testing
        await client.query('ROLLBACK');
      } else {
        await client.query('COMMIT');
      }

    } catch (err) {
      await client.query('ROLLBACK');
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adopter DELETE (TOKEN, VARCHAR, OWNER_ID) err', err);
    } finally {
      // [Release client back to pool]
      if (client) {
        client.release();
      } else {
        console.error('!!! MAKE SURE DATABASE IS RUNNING!!! adopter DELETE');
      }

      // [Configure Debugging]
      new ApiDebug('adopter', apiDebug).show(req.headers, req.payload, result);

      // [Return status, msg, and insertion (copy of the inserted record)]
      // eslint-disable-next-line no-unsafe-finally
      return result;
      /* $lab:coverage:on$ */
    }
  },
  options: {
        cors: {
            origin: JSON.parse(process.env.ACCEPTED_ORIGINS),
            headers:['Authorization', 'Content-Type'],
            exposedHeaders: ['Accept', 'Api_Options'],
          },
        description: 'Adopter',
        notes: 'Returns {} ',
        tags: ['api','adopter'],
        auth: {
          mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_user']
          }
        }
        ,
        validate: {
          params: Joi.object({
            id: Joi.string().min(3).max(320)
          }),
          headers: Joi.object({
               'authorization': Joi.string().required(),
               'owner': Joi.string().required()

          }).unknown()
        }
        
    }
};