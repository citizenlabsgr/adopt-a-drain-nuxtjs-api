'use strict';
const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');
// const TestHelper = require('./util/route_test_helper');
// const Consts = require('../constants/consts');
module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: 'POST',
  path: '/signin',
  handler: async function (req) {
    // [Define a /signin POST route handler]
    /* $lab:coverage:off$ */
    let result = {status:"200", msg:"OK"};
    let client ;
    let token ; // guest token
    let form ;
    const options = req.headers.api_options;
    const apiTest = options.test || false;
    const apiDebug = options.debug || false;
    // const apiTimeout = options.timeout || Consts.default_timeout();

    try {  
   
      // [Get the API Token from request]
      token = req.headers.authorization; // guest token
      token = `("${token.replace('Bearer ','')}")`;
      // [Get a database client from request]
      client = req.pg;
      // [Get form from request.params]
      form = req.payload;
      
      // [Optionally insert a test user when test in header]
      if (apiTest) {
        // [Inititate a transation when test is invoked]
        await client.query('BEGIN');
        // [Insert a transation when test is invoked]
        // const resA = 
        await client.query(
          {
            text: 'select * from api_0_0_1.signup($1::TOKEN,$2::JSONB)',
            values: [token,
                     JSON.stringify(apiTest)]
          }
        );
        // console.log('    TEST signin add user for test', resA.rows);
      }

      // [Get credentials from request]
      
      const res = await client.query(
        {
          text: 'select * from api_0_0_1.signin($1::TOKEN,$2::JSONB)',
          values: [token,
                   form 
                  ]
        }
      );
      
  
      result = res.rows[0].signin;

      if (apiTest) {
        // [Rollback transaction when when test is invoked]
        await client.query('ROLLBACK');
      }
      // $lab:coverage:on$
    } catch (err) {
      // [Catch any exceptions]
      /* $lab:coverage:off$ */

      if (apiTest) {
        // [Rollback transacton when excepton occurs and test is invoked]
        await client.query('ROLLBACK');
      }

      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/signin err',err);
      /* $lab:coverage:on$ */
    
    } finally {
      // [Release client back to pool]
      /* $lab:coverage:off$ */
      if (client) {
        client.release();
      }  else {
        console.error('!!! MAKE SURE DATABASE IS RUNNING!!! signin ');
      }

      new ApiDebug('signin', apiDebug).show(req.headers, req.payload, result);

      // [Return {status, msg, token}]
      // eslint-disable-next-line no-unsafe-finally
      return result;
      /* $lab:coverage:on$ */  
    }
  },
  options: {
        cors: {
          origin: JSON.parse(process.env.ACCEPTED_ORIGINS),
          headers:['Authorization', 'Content-Type'],
          additionalHeaders:['ApiDebug', 'ApiTimeout', 'ApiTest'],
          exposedHeaders: ['Accept'],
        },
        description: 'User Signin with Guest Token',
        notes: 'signin(token, credentials) Returns a {credentials: {username: email}, authentication: {token: JWT} | false }',
        tags: ['api', 'signin'],
        auth: {
          mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_guest']
          }
        },
        validate: {
          payload: Joi.object({
            username: Joi.string().min(1).max(320).required(),
            password: Joi.string().min(8).required()
          }),
          headers: Joi.object({
               'authorization': Joi.string().required()
          }).unknown()
        }
    }
};
