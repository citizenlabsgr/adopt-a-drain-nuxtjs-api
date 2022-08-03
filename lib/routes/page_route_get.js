'use strict';
const Joi = require('joi');

const ApiDebug = require('./debug/debug_api');
const TestHelper = require('../util/test_helper.js');

module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  // id is PK(pk,sk)

    method: ['GET'],
    path: '/page/{owner}/PK/{pk}/{sk?}',
    handler: async function (req) {
        // console.log('page_route_get 1 ',req.method);

        // [Define a /page GET route handler]
        /* $lab:coverage:off$ */
        // expect id to be PK(pk,sk)
        const apiDebug = req.headers.debug || false;
        let apiTest = req.headers.test || false;
        // [Get token, owner and id]
        const token = `("${req.headers.authorization.replace('Bearer ','')}")` ;
        const owner = `("${req.params.owner}")`;
        let pk = req.params.pk;
        let sk = req.params.sk || '*';

        const id = `("${pk}","${sk}")`;

        let result = {status:"200", msg:"OK"};
        let client = req.pg || false;

        try {
          /* $lab:coverage:off$ */
          let res ;
          if (apiTest) {
              // console.log('page_route_get query A ');
              await client.query('BEGIN'); // start transaction to rollback test data
            let function_name = 'page';
            apiTest = JSON.parse(apiTest);
            let testHelper = new TestHelper(client, function_name);
            await testHelper.post(apiTest.data, apiTest.owners); // post array of test data
          }
            // console.log('page_route_get query B ', owner, pk, id);
            // console.log('page_route_get query B ', token);

           if (owner && pk) {
            // GET specific owner and id
               // console.log('page_route_get query C');

               res = await client.query(
                {
                  text: 'select * from api_0_0_1.page($1::TOKEN,$2::OWNER_ID,$3::PRIMARYKEY)',
                  values: [
                    token,
                    owner,
                    id
                  ]
                }
              );
          } else if (owner && !pk) {
               // console.log('page_route_get query D');

               // GET all pages for owner

            res = {"rows":[{"page_del":{"status":"404", "msg":"page(TOKEN,OWNER_ID) is not implemented!"}}]};
            /*
            res = await client.query(
                {
                  text: 'select * from api_0_0_1.page_del($1::TOKEN,$2::OWNER_ID)',
                  values: [
                    token,
                    owner
                  ]
                }
            );
            */

          } else {
               // console.log('page_route_get query E');

               throw new Error('Bad Request');
          }
          result = res.rows[0].page;

        } catch (err) {
          // [Catch any exceptions]
            // console.log('page_route_get query F');

            result.status = '500';
          result.msg = 'Unknown Error';
          result['error'] = err;
          console.error('/page GET err',err);

        } finally {
          // [Release client back to pool]
          if (apiTest) {
            // roll back test data
            await client.query('ROLLBACK');
          }

          if (client) {
            client.release();
          } else {
            console.error('!!! MAKE SURE DATABASE IS RUNNING!!! page GET');
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
            exposedHeaders: ['Accept'],
        },
        description: 'page with Guest Token',
        notes: 'page(token, owner, id)',
        tags: ['api','page'],
        auth: {
          mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_admin','api_user','api_guest']
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
            pk: Joi.string().min(3).max(320),
            sk: Joi.string().min(3).max(320)
          }),
        }
    }
};
