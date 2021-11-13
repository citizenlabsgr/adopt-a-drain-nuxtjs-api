'use strict';
const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');
const { v4: uuidv4 } = require('uuid');

// [Route: adopter]
// [Description: post changes to adopter (no password)]
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
  method: ['POST'],
  path: '/adopter',
  handler: async function (req) {
    /* $lab:coverage:off$ */
    // [Define a /signup POST route handler]
    // [Signup is a convenience route for /user]
    let result = {status:"200", msg:"OK"};
    let client ;
    let token ; // user token
    
    let options = req.headers.api_options || false;
    let rollback = options.rollback || false;
    let apiDebug = options.debug || false;
    let form = req.payload || false;
    let owner = req.headers.owner || uuidv4() || false;

    try {
      // [Optionally rollback insert with headers.cleanup=true]
      // rollback = req.headers.rollback || false;
      // [Get the API Token from request]
      // token = req.headers.authorization; // guest token
          // [Fix the parameters]
      token = `("${req.headers.authorization.replace('Bearer ','')}")`; 
      owner = `("${owner.replace('Bearer ','')}")`;
      // [Get a database client from request]
      client = req.pg;
      // [Get pk from request.payload]

      // [ User into the database]
      await client.query('BEGIN');
      let queryObj;
                
      queryObj = {
            text: 'select * from api_0_0_1.adopter($1::TOKEN,$2::JSONB,$3::OWNER_ID)',
            values: [token, 
                     form,
                     owner]
      };

      let res = await client.query(queryObj);

      result = res.rows[0].adopter;

      if (rollback) {
        await client.query('ROLLBACK');
      } else {
        await client.query('COMMIT');
      }

    } catch (err) {
      // [Catch any exceptions]
      await client.query('ROLLBACK');
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adopter POST (TOKEN, JSON, OWNER_ID) err', err);
    } finally {

      // [Release client back to pool]
      if (client) {
        client.release();
      } else {
        console.error('!!! MAKE SURE DATABASE IS RUNNING!!! adopter POST');
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
            scope: ['api_admin']
          }
        },
        validate: {
          payload: Joi.object({
            
              username: Joi.string().min(1).max(320).required(),
              displayname: Joi.string().min(1).max(20).required(),
              password: Joi.string().min(7).required()
            
          }),
          headers: Joi.object({
               'authorization': Joi.string().required(),
               'owner': Joi.string().required(),
          }).unknown()
        }
    }
};