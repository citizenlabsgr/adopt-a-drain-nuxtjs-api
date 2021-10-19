'use strict';
const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');
const Jwt = require('@hapi/jwt');
const UserTokenPayload = require('../auth/token_payload_user');

// [Route: adopter]
// [Description: put changes in adopter ]
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
  method: ['PUT'],
  path: '/adopter/{id}',
  handler: async function (req) {
    /* $lab:coverage:off$ */
    
    // [Define a /adopter PUT route handler]
    
    let result = {status:"200", msg:"OK"};
    let client = req.pg || false;
    let token = req.headers.authorization || false; 
    let options = req.headers.api_options || false;
    let apiDebug = options.debug || false;
    let apiTest = options.test || false;
    let payloadForm = req.payload || false;
    const owner = req.headers.owner || false;
    const id = req.params.id || false;
    // [Get Parameters]    
    try {

      // [Optionally insert a test user when test in header]
      if (apiTest) {
        const post_token = options.token || false; 
        // [Inititate a transation when test is invoked]
        await client.query('BEGIN');

        // [Insert a transation when test is invoked]
        const resA = await client.query(
          {
            text: 'select * from api_0_0_1.adopter($1::TEXT,$2::JSON, $3::TEXT)',
            values: [post_token,
                     JSON.stringify(apiTest),
                     owner]
          }
        );

        if (!resA) {
          throw new Error("Test failed");
        }  
        // console.log('--  TEST PUT adopter, add user for test resA', resA.rows[0]);
        // console.log('--  TEST PUT adopter, add user for test resA', resA.rows[0].adopter.insertion);

        // [User token needed to query user/adopter]
        token = Jwt.token.generate(new UserTokenPayload(
          resA.rows[0].adopter.insertion.form.username, 
          resA.rows[0].adopter.insertion.owner, 
          'api_user', 
          5000).payload(), 
          process.env.JWT_SECRET);
     
      } // End Test
    } catch (err) {
      await client.query('ROLLBACK');
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adoptor (TEXT, TEXT) err', err);
    }

    try {

      // [ Get User from the database]
      await client.query('BEGIN');
      let queryObj;
     
      queryObj = {
        text: 'select * from api_0_0_1.adopter($1::TEXT,$2::TEXT,$3::JSON,$4::TEXT)',
        values: [token,
                 id,
                 payloadForm,
                 owner]
      };
      
      let res = await client.query(queryObj);
      result = res.rows[0].adopter;
      if (apiTest) {
        console.log('rollback');
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
      console.error('/adoptor (TEXT, TEXT) err', err);
    } finally {
      // [Release client back to pool]
      if (client) {
        client.release();
      } else {
        console.error('!!! MAKE SURE DATABASE IS RUNNING!!! B');
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
               'owner': Joi.string().required(),
          }).unknown()
        }
        
    }
};