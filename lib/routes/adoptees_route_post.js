'use strict';
const Joi = require('joi');

module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: 'POST',
  path: '/adoptees',
  handler: async function (req) {
    // [Define a /signin POST route handler]
    /* $lab:coverage:off$ */
    let result = {status:"200", msg:"OK"};
    let client ;
    let token ; // guest token
    let form ; // MBR
    /* $lab:coverage:on$ */
    // const test = req.headers.test || false;

    try {  
      
      // [Get the API Token from request]
      token = req.headers.authorization; // guest token
      // [Get form containing MBR {west:0.0, east:0.0, north:0.0, south:0.0}]
      form = req.payload || false ;
      console.log('form', form);
      // [Get a database client from request]
      client = req.pg;
      console.log('client ', client);
      // [Optionally insert a test user when test in header]
      /*
      if (test) {
        // [Inititate a transation when test is invoked]
        await client.query('BEGIN');
        // [Insert a transation when test is invoked]
        const resA = await client.query(
          {
            text: 'select * from api_0_0_1.adoptees($1::TEXT,$2::JSON)',
            values: [token,
                     JSON.stringify(test)]
          }
        );
        console.log('signin add user for test', resA.result);
      }
      */
      
      // [Get credentials from request]
      const res = await client.query(
        {
          text: 'select * from api_0_0_1.adoptees($1::TEXT,$2::JSON)',
          values: [token.replace('Bearer ',''),
                   form]
        }
      );

      result = res.rows[0].adoptees;
      /*
      if (test) {
        // [Rollback transaction when when test is invoked]
        await client.query('ROLLBACK');
      }
      */
    } catch (err) {
      // [Catch any exceptions]
      /* $lab:coverage:off$ */
      /*
      if (test) {
        // [Rollback transacton when excepton occurs and test is invoked]
        await client.query('ROLLBACK');
      }
      */

      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/signin err',err);
      /* $lab:coverage:on$ */
    
    } finally {
      // [Release client back to pool]
      /* $lab:coverage:off$ */
      client.release();
      // [Return {status, msg, token}]
      // eslint-disable-next-line no-unsafe-finally
      return result;
      /* $lab:coverage:on$ */  
    }
  },
  options: {
        cors: {
            origin:["*"],
            headers:['Accept', 'Authorization', 'Content-Type', 'If-None-Match', 'Content-Profile']
        },
        description: 'User Signin with Guest Token',
        notes: 'adoptees(token, credentials)',
        tags: ['api','adoptees'],
        auth: {
          mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_guest']
          }
        },
        validate: {
          payload: Joi.object({
            west: Joi.number().greater(-180.0).less(180.0),
            east: Joi.number().greater(-180.0).less(180.0),
            north: Joi.number().greater(-180.0).less(180.0),
            south: Joi.number().greater(-180.0).less(180.0)
          }),
          headers: Joi.object({
               'authorization': Joi.string().required()
          }).unknown()
        }
    }
};
