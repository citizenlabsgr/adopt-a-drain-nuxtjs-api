'use strict';
const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');
// const TestHelper = require('../util/route_test_helper');

module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: 'POST',
  path: '/adoptee',
  handler: async function (req) {
    // [Define a /adoptee GET route handler]
    /* $lab:coverage:off$ */
    // console.log('Adoptee POST 1');
    let result = {status:"200", msg:"OK"};
    let client = req.pg || false;
    let token = req.headers.authorization || false; 
    
    const options = req.headers.api_options || false;
    let rollback = options.rollback || false;
    const apiDebug = options.debug || false;
    let form = req.payload || false;
    let owner = req.headers.owner || false;
    // console.log('Adoptee POST 2 form',form);
    token = token.replace('Bearer ','');
    token = `("${token}")`; // guest token
    owner = `("${owner.replace('Bearer ','')}")`;

    /* $lab:coverage:on$ */

    try {  
      /* $lab:coverage:off$ */
      await client.query('BEGIN'); // start transaction to rollback test data

      /* $lab:coverage:on$ */
      const res = await client.query(
        {
          text: 'select * from api_0_0_1.adoptee($1::TOKEN,$2::JSONB,$3::OWNER_ID)',
          values: [token,
                   form,
                  owner]
        }
      );

      result = res.rows[0].adoptee;
      
      if (rollback) {
        // console.log('Adoptee POST rollback');
        await client.query('ROLLBACK');
      } else {
        await client.query('COMMIT');
      }

    } catch (err) {
      // [Catch any exceptions]
      /* $lab:coverage:off$ */
      await client.query('ROLLBACK'); 
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adoptee POST (TOKEN,JSONB,OWNER_ID) err',err);
      /* $lab:coverage:on$ */
    
    } finally {
      // [Release client back to pool]
      /* $lab:coverage:off$ */
      if (client) {
        client.release();
      } else {
        console.error('!!! MAKE SURE DATABASE IS RUNNING!!! Adoptee POST');
      }

      // [Configure Debugging]
      new ApiDebug('adoptee', apiDebug).show(req.headers, req.payload, result);
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
        notes: 'adoptee(token, jsonb, owner)',
        tags: ['api','adoptee'],
        auth: {
          mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_user']
          }
        },
        validate: {
          headers: Joi.object({
               'authorization': Joi.string().required(),
               'owner': Joi.string().required()
          }).unknown()
        }
    }
};
