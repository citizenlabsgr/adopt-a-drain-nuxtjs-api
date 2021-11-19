'use strict';
/* 
DEPRECATED
*/
const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');
// const TestHelper = require('./util/test_helper');


module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: 'POST',
  path: '/adoptees',
  handler: async function (req) {
    // [Define a /adoptees POST route handler]
    /* $lab:coverage:off$ */
    let result = {status:"200", msg:"OK"};
    // [Get a database client from request]
    let client = req.pg || false;
    // [Get the API Token from request]
    let token = req.headers.authorization || false; 
    token = token.replace('Bearer ','');
    token = `("${token}")`; // guest token

    let form = req.payload || false ; // MBR
    const apiDebug = req.headers.debug || false;
    
    /* $lab:coverage:on$ */

    try {  
      /* $lab:coverage:off$ */
      
      /* $lab:coverage:on$ */
  
      const res = await client.query(
        {
          text: 'select * from api_0_0_1.adoptees($1::TOKEN,$2::JSONB)',
          values: [token,
                   form]
        }
      );

      result = res.rows[0].adoptees;

    } catch (err) {
      // [Catch any exceptions]
      /* $lab:coverage:off$ */

      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adoptees err',err);
      /* $lab:coverage:on$ */
    
    } finally {
      // [Release client back to pool]
      /* $lab:coverage:off$ */
      if (client) {client.release();}
      new ApiDebug('adoptees', apiDebug).show(req.headers, req.payload, result);
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
            exposedHeaders: ['Accept', 'Api_Options'],
        },
        description: 'Adoptee with Guest Token',
        notes: 'adoptees(token, mbr)',
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
            west: Joi.number().greater(-180.0).less(0.0),
                  east: Joi.number().greater(0.0).less(180.0),
                  north: Joi.number().greater(0.0).less(90.0),
                  south: Joi.number().greater(-90.0).less(0.0)
          }),
          headers: Joi.object({
               'authorization': Joi.string().required()
          }).unknown()
        }
    }
};
