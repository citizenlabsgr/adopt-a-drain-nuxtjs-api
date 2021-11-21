'use strict';
const Joi = require('joi');

const ApiDebug = require('./debug/debug_api');
const TestHelper = require('../util/test_helper.js');

module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: 'DELETE',
  path: '/adoptee/{owner}/{id?}',
  handler: async function (req) {
    // [Define a /adoptee DELETE route handler]
    /* $lab:coverage:off$ */    

    const apiDebug = req.headers.debug || false;
    let apiTest = req.headers.test || false;
    // [Get token, owner and id]
    const token = `("${req.headers.authorization.replace('Bearer ','')}")` ; 
    const owner = `("${req.params.owner}")`; 
    const id = `("${req.params.id}")`;

    let result = {status:"200", msg:"OK"};
    let client = req.pg || false;    

    try {  
      /* $lab:coverage:off$ */
      let res ;
      if (apiTest) {
        await client.query('BEGIN'); // start transaction to rollback test data
        let function_name = 'adoptee';
        apiTest = JSON.parse(apiTest);
        let testHelper = new TestHelper(client, function_name);
        await testHelper.post(apiTest.data, apiTest.owners); // post array of test data
      }
      
       if (owner && id) {  
        // Get specific owner and id
      
         res = await client.query(
            {
              text: 'select * from api_0_0_1.adoptee_del($1::TOKEN,$2::OWNER_ID,$3::IDENTITY)',
              values: [
                token,
                owner,
                id
              ]
            }
          );
      } else if (owner && !id) {
        // Get all adoptees for owner

        res = {"rows":[{"adoptee_del":{"status":"404", "msg":"adoptee(TOKEN,OWNER_ID) is not implemented!"}}]};
        /*
        res = await client.query(
            {
              text: 'select * from api_0_0_1.adoptee_del($1::TOKEN,$2::OWNER_ID)',
              values: [
                token,
                owner
              ]
            }
        );
        */
      
      } else {
        throw new Error('Bad Request');
      }
      result = res.rows[0].adoptee_del;

    } catch (err) {
      // [Catch any exceptions]
      
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adoptee DELETE err',err);
    
    } finally {
      // [Release client back to pool]
      if (apiTest) { 
        // roll back test data
        await client.query('ROLLBACK'); 
      } 
      
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
      // $lab:coverage:on$    
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
