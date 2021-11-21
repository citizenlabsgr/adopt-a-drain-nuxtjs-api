'use strict';
const Joi = require('joi');

const ApiDebug = require('./debug/debug_api');
const TestHelper = require('../util/test_helper.js');

module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: 'GET',
  path: '/adoptee/{owner}/{id?}',
  handler: async function (req) {
    // [Define a /adoptee GET route handler]
    /* $lab:coverage:off$ */
    const apiDebug = req.headers.debug || false;
    let apiTest = req.headers.test || false;
    // [Get token, owner and id]
    const token = `("${req.headers.authorization.replace('Bearer ','')}")` ; 
    const owner = `("${req.params.owner}")` ;
    const id = `("${req.params.id}")`; // '("false")' is same as false

    let result = {status:"200", msg:"OK"};
    let client = req.pg || false;    

    /* $lab:coverage:on$ */

    try {  
      /* $lab:coverage:off$ */
      let res ;
      if (apiTest) {
        // [Optionally insert a test user when test in header]
        await client.query('BEGIN'); // start transaction to rollback test data
        let function_name = 'adoptee';
        let testHelper = new TestHelper(client, function_name);
        apiTest = JSON.parse(apiTest);
        await testHelper.post(apiTest.data, apiTest.owners); // post array of test data
      }
      
      if (owner && id) {
        // if (token) {
          res = await client.query(
            {
              text: 'select * from api_0_0_1.adoptee($1::TOKEN,$2::OWNER_ID,$3::IDENTITY)',
              values: [
                token,
                owner,
                id
              ]
            }
          );
        // }
      } else if (owner && !id) {
        console.log('token', token);

        console.log('owner && !id', owner, id);
        res = await client.query(
          {
            text: 'select * from api_0_0_1.adoptee($1::TOKEN,$2::OWNER_ID)',
            values: [
              token,
              owner
            ]
          }
        );

      } else {
        throw new Error('Bad Request');
      }
      if (res) {
        result = res.rows[0].adoptee;
      }

    } catch (err) {
      // [Catch any exceptions]      
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adoptee GET err',err);
      
    } finally {
      if (apiTest) { 
        // roll back test data
        await client.query('ROLLBACK'); 
      } 
      // [Release client back to pool]
      if (client) {
        client.release();
      } else {
        console.error('!!! MAKE SURE DATABASE IS RUNNING!!! Adoptee GET');
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
            exposedHeaders: ['Accept'],
        },
        description: 'Adoptee with Guest Token',
        notes: 'adoptee(token, mbr)',
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
               'debug': Joi.boolean().optional(),
               'test': Joi.string().optional() 
          }).unknown(),
          params: Joi.object({
            owner: Joi.string().min(3).max(320).required(),
            id: Joi.string().min(3).max(320)
          }),
        }
    }
};
