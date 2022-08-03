
// page_route_put
'use strict';
const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');
const TestHelper = require('../util/test_helper.js');

// [Route: page]
// [Description: put changes in page ]
// [Role: api_admin]
// [Header: token]
// [Header: rollback , default is false]

// const ChelateUser = require('../../lib/chelates/chelate_user.js');


// Put page
// requires a admin-token
// payload must contain {pk:"", sk:"", ...} or  {sk:"", tk:"", ...}
// payload must contain a {...,"form": {...}} key


module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: ['PUT'],
  path: '/page/{owner}/PK/{pk}/{sk}',
  handler: async function (req) {
    // $lab:coverage:off$
    // console.log('page route put 1', req.params);
    // [Define a /page PUT route handler]
    let result = {status:"200", msg:"OK"};

    const token = `("${req.headers.authorization.replace('Bearer ','')}")`;
    const owner = `("${req.params.owner}")`;
    const id = `("${req.params.pk}","${req.params.sk}")`;

    let client = req.pg || false;
    let apiDebug = req.headers.debug || false;
    let apiTest = req.headers.test || false;
    const payloadForm = req.payload ;

    // [Get Parameters]    

    try {
      await client.query('BEGIN'); // start transaction to rollback test data
      if (apiTest) {
        // console.log('page route PUT tests');
        let function_name = 'page';
        let testHelper = new TestHelper(client, function_name);
        apiTest = JSON.parse(apiTest);
        await testHelper.post(apiTest.data, apiTest.owners); // post array of test data
      }

      // [ Get User from the database]
      let queryObj;
     
      queryObj = {
        text: 'select * from api_0_0_1.page($1::TOKEN,$2::OWNER_ID,$3::PRIMARYKEY,$4::JSONB)',
        values: [
          token,
          owner,
          id,
          payloadForm]
      };
      
      let res = await client.query(queryObj);
      result = res.rows[0].page;


    } catch (err) {
      console.log('    rollback page');
      await client.query('ROLLBACK');
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/page PUT (TOKEN, OWNER_ID, IDENTITY, JSON) err', err);
    } finally {
      if (apiTest) {
        // rollback for testing
        console.log('    rollback page');
        await client.query('ROLLBACK');
      } else {
        await client.query('COMMIT');
      }
      // [Release client back to pool]
      if (client) {
        client.release();
      } else {
        console.error('!!! MAKE SURE DATABASE IS RUNNING!!! Adopter PUT');
      }
      // [Configure Debugging]
      new ApiDebug('page', apiDebug).show(req.headers, req.payload, result);

      // [Return status, msg, and insertion (copy of the inserted record)]
      // eslint-disable-next-line no-unsafe-finally
      return result;
      // $lab:coverage:on$
    }

    // return result;
  },
  options: {
        cors: {
            origin: JSON.parse(process.env.ACCEPTED_ORIGINS),
            headers:['Authorization', 'Content-Type'],
            exposedHeaders: ['Accept'],
          },
        description: 'Page update',
        notes: 'Returns {} ',
        tags: ['api','page'],
        auth: {
          mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_admin']
          }
        }
        ,
        validate: {
          headers: Joi.object({
            'authorization': Joi.string().required(),
            'debug': Joi.boolean().optional(),
            'test': Joi.string().optional()
          }).unknown(),
          params: Joi.object({
            owner: Joi.string().min(3).max(320).required(),
            pk: Joi.string().min(3).max(320),
            sk: Joi.string().min(3).max(320)
          }),

          payload: Joi.object().required()
        }

    }
};
