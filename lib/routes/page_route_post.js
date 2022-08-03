
// page_route_post

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
  path: '/page/{owner}',
  handler: async function (req) {
    // handler: async function (req) {
    // console.log('page POST 1');
    // [Define a /page GET route handler]
    // $lab:coverage:off$
    let result = {status:"200", msg:"OK"};
    let client = req.pg ;
    let token = req.headers.authorization || false; 
    
    let form = req.payload ;    
    let rollback   = req.headers.rollback || false;
    const apiDebug = req.headers.debug || false;
    // console.log('req.headers ', req.headers);
    let test = req.headers.test || false; // convert from string
    let owner = req.params.owner ;

    // [format parameters: TOKEN, JSONB, and OWNER_ID]
    token = token.replace('Bearer ','');
    token = `("${token}")`; // guest token
    owner = `("${owner}")`;
 
    // $lab:coverage:on$

    try {  
          // $lab:coverage:off$
          await client.query('BEGIN'); // start transaction to rollback test data

          // $lab:coverage:on$

          let res;
          // [add test records when test is defined]
          if (test) { // test is an array of JSON objects
            // console.log('  Test data enabled... set test=false to stop');
            const testHelper = new TestHelper(client, 'page');
            test = JSON.parse(test);
            await testHelper.post(test.data,test.owners );
          }
     
         res = await client.query(
            {
              text: 'select * from api_0_0_1.page($1::TOKEN,$2::OWNER_ID,$3::JSONB)',
              values: [
                token,
                owner,
                form
              ]
            }
          );
      
      result = res.rows[0].page;
      
    } catch (err) {
      // [Catch any exceptions]
      // $lab:coverage:off$
      // await client.query('ROLLBACK'); 
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/page POST (TOKEN,OWNER_ID,JSONB) err',err);
      // $lab:coverage:on$
    
    } finally {

      if (rollback || test) {
        await client.query('ROLLBACK');
      } else {
        await client.query('COMMIT');
      }
      // [Release client back to pool]
      // $lab:coverage:off$
      if (client) {
        client.release();
      } else {
        console.error('!!! MAKE SURE DATABASE IS RUNNING!!! Page POST');
      }

      // [Configure Debugging]
      new ApiDebug('page', apiDebug).show(req.headers, req.payload, result);
      // [Return {status, msg, token}]
      // eslint-disable-next-line no-unsafe-finally
      return result;
      // $lab:coverage:on$
    }
  },
  options: {
        cors: {
            origin: JSON.parse(process.env.ACCEPTED_ORIGINS),
            headers:['Authorization', 'Content-Type'],
            exposedHeaders: ['Accept']
        },
        description: 'page with Guest Token',
        notes: 'page(token, jsonb, owner)',
        tags: ['api','page'],
        auth: {
          mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_admin']
          }
        },
        validate: {
          headers: Joi.object({
               'authorization': Joi.string().required(),
               
               'rollback': Joi.boolean().optional(),
               'test': Joi.string().optional() // yes, pass JSON as string 
          }).unknown(),
          params: Joi.object({
            'owner': Joi.string().min(3).max(320).required()
          }),
          payload: Joi.object().required()
        }
    }
};

/*
,
               'test': Joi.string().optional(),
               'debug': Joi.boolean().optional()
*/