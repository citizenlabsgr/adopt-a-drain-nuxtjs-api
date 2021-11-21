'use strict';
const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');
// const Jwt = require('@hapi/jwt');
// const UserTokenPayload = require('../auth/token_payload_user');
const TestHelper = require('../util/test_helper.js');

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
  method: ['GET'],
  path: '/adopter/{owner}/{id}',
  handler: async function (req) {
    // [Define a /adopter GET route handler]

    /* $lab:coverage:off$ */
    const token = `("${req.headers.authorization}")`; 
    const owner = `("${req.params.owner}")` ;
    const id = `("${req.params.id}")`;
    let result = {status:"200", msg:"OK"};
    let client = req.pg || false;
    let apiDebug = req.headers.debug || false;
    let apiTest = req.headers.test || false;
    // [Get Parameters]    
    
    try {
      if (apiTest) {
        // [Optionally insert a test user when test in header]
        await client.query('BEGIN'); // start transaction to rollback test data
        let function_name = 'adopter';
        let testHelper = new TestHelper(client, function_name);
        apiTest = JSON.parse(apiTest);
        await testHelper.post(apiTest.data, apiTest.owners); // post array of test data
      }
      // [ Get User from the database]

      let queryObj;
      queryObj = {
        text: 'select * from api_0_0_1.adopter($1::TOKEN,$2::OWNER_ID,$3::IDENTITY)',
        values: [token,
                 owner,
                 id]
      };

      let res = await client.query(queryObj);

      result = res.rows[0].adopter;

    } catch (err) {
      // if (apiTest) {
      //  await client.query('ROLLBACK');
      // }
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adopter/owner/id GET (TOKEN, OWNER_ID, IDENTITY) err', err);
    } finally {
      if (apiTest) {
        // rollback for testing
        await client.query('ROLLBACK');
      }
      // [Release client back to pool]
      if (client) {
        client.release();
      } else {
        console.error('!!! MAKE SURE DATABASE IS RUNNING!!! Adopter GET');
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
            exposedHeaders: ['Accept'],
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
            'owner': Joi.string().min(3).max(320).required(),
            'id': Joi.string().min(3).max(320).required()
          }),
          headers: Joi.object({
               'authorization': Joi.string().required(),
               'test': Joi.string().optional() 
          }).unknown()
        }
        
    }
};