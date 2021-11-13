'use strict';
const Joi = require('joi');

const ApiDebug = require('./debug/debug_api');
const TestHelper = require('../util/route_test_helper');

module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: 'GET',
  path: '/adoptee',
  handler: async function (req) {
    // [Define a /adoptee GET route handler]
    /* $lab:coverage:off$ */
    // console.log('Adoptee GET 1');

    let result = {status:"200", msg:"OK"};
    let client = req.pg || false;
    let token = req.headers.authorization || false; 
    
    const options = req.headers.api_options || false;
    const apiDebug = options.debug || false;
    const apiTest = options.test || false;
    const mbr = options.mbr || false;
    
    token = token.replace('Bearer ','');
    token = `("${token}")`; // guest token
    try{
      // [Optionally insert a test user when test in header]
      if (apiTest) {
        await client.query('BEGIN'); // start transaction to rollback test data
        let function_name = 'adoptee';
        let testHelper = new TestHelper(client, function_name);
        await testHelper.post(apiTest.data, apiTest.owners); // post array of test data
      }
    } catch (err) {
      await client.query('ROLLBACK');
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adoptee GET TEST MBR  (TOKEN, JSON) err', err);
    }
    
    // let owner = req.headers.owner || false;
    // get all items by owner for owner, 
    // pk sk !tk owner*: get one item by owner, adoptee/{id}
    // pk sk !tk owner: get specific item by owner, adoptee/{id}
    
    // sk tk* !tk, mbr: get everything in mbr adoptee/{id}/{id}
    // sk tk* !tk, !mbr: get all items, adoptee/{id}/{id}
    // const decodedToken = Jwt.token.decode(token);
    
    // form = {"sk": "const#ADOPTEE","tk": "*", "mbr":mbr};

    /* $lab:coverage:on$ */

    try {  
      /* $lab:coverage:off$ */
      
      /* $lab:coverage:on$ */
      if (!mbr) {
        throw new Error(`Route missing mbr`);
      }

      const res = await client.query(
            {
              text: 'select * from api_0_0_1.adoptee($1::TOKEN,$2::MBR)',
              values: [token,
                `(${mbr.north},${mbr.south},${mbr.west},${mbr.east})`
              ]
            }
          );
       

      result = res.rows[0].adoptee;

    } catch (err) {
      // [Catch any exceptions]
      /* $lab:coverage:off$ */
      if (apiTest) { 
        // roll back test data
        await client.query('ROLLBACK'); 
      } 
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adoptee GET err',err);
      /* $lab:coverage:on$ */
    
    } finally {
      // [Release client back to pool]
      /* $lab:coverage:off$ */
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
            exposedHeaders: ['Accept', 'Api_Options'],
        },
        description: 'Adoptee with Guest Token',
        notes: 'adoptee(token, json)',
        tags: ['api','adoptee'],
        auth: {
          mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_guest']
          }
        },
        validate: {
          headers: Joi.object({
               'authorization': Joi.string().required()
          }).unknown()
        }
    }
};
