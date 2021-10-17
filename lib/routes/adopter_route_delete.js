'use strict';
const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');

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
    let client ;
    let token ; // user token
    let options = req.headers.api_options || false;
    let apiDebug = options.debug || false;
    let apiTest = options.test || false;

    // [Get Parameters]    
    let tmp_id = req.params.id;

    try {
   
      // [Get the API Token from request]
      token = req.headers.authorization; // user token

      // [Get a database client from request]
      client = req.pg;

      // [Optionally insert a test user when test in header]
      if (apiTest) {
        const guest_token = options.guest_token || false; 

        // [Inititate a transation when test is invoked]
        await client.query('BEGIN');

        // [Insert a user when test is invoked]
        const resA = await client.query(
          {
            text: 'select * from api_0_0_1.signup($1::TEXT,$2::JSON)',
            values: [guest_token,
                     JSON.stringify(apiTest)]
          }
        );
        if (!resA) {
          throw new Error("Test failed");
        }  
        // [Get test owner id]
        tmp_id = resA.rows[0].signup.insertion.owner;
      }

      // [ User into the database]
      await client.query('BEGIN');
      let queryObj;
      
      const id = tmp_id; 

      queryObj = {
        text: 'select * from api_0_0_1.adopter($1::TEXT,$2::VARCHAR)',
        values: [token,
                  id]
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
      console.error('/adoptor delete (TEXT, VARCHAR) err', err);
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
               'authorization': Joi.string().required()
          }).unknown()
        }
        
    }
};