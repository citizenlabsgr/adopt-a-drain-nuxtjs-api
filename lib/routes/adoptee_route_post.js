'use strict';
const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');
const TestHelper = require('../util/test_helper.js');

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
    let result = {status:"200", msg:"OK"};
    let client = req.pg || false;
    let token = req.headers.authorization || false; 
    
    let form = req.payload || false;    
    let rollback   = req.headers.rollback || false;
    const apiDebug = req.headers.debug || false;
    let owner      = req.headers.owner || 0;
    let test = req.headers.test || false; // convert from string

    // [format parameters: TOKEN, JSONB, and OWNER_ID]
    token = token.replace('Bearer ','');
    token = `("${token}")`; // guest token
    owner = `("${owner}")`;
 
    /* $lab:coverage:on$ */

    try {  
      /* $lab:coverage:off$ */
      await client.query('BEGIN'); // start transaction to rollback test data

      /* $lab:coverage:on$ */
    
      let res;
      if (owner === '("0")') {
        const testHelper = new TestHelper(client, 'adoptee');

        // [add test records when test is defined]
        if (test) { // test is an array of JSON objects
          test = JSON.parse(test);
          await testHelper.post(test.data,test.owners );
        }
        let m_b_r = `(${form.north},${form.south},${form.west},${form.east})`;
          res = await client.query(
            {
              text: 'select * from api_0_0_1.adoptee($1::TOKEN,$2::MBR)',
              values: [token,
                      m_b_r]
            }
          );
      } else {

         res = await client.query(
            {
              text: 'select * from api_0_0_1.adoptee($1::TOKEN,$2::OWNER_ID,$3::JSONB)',
              values: [
                token,
                owner,
                form
              ]
            }
          );
      }

      result = res.rows[0].adoptee;
      
      if (rollback) {
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
            scope: ['api_guest', 'api_user']
          }
        },
        validate: {
          headers: Joi.object({
               'authorization': Joi.string().required(),
               'owner': Joi.string().required(),
               'rollback': Joi.boolean().optional(),
               'test': Joi.string().optional() // yes, pass JSON as string 
          }).unknown(),
          payload: Joi.object().required()
        }
    }
};
/*
,
               'test': Joi.string().optional(),
               'debug': Joi.boolean().optional()
*/