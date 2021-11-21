const Joi = require('joi');
const ApiDebug = require('./debug/debug_api');
const TestHelper = require('../util/test_helper.js');

const headerSchema = Joi.object({
    'authorization': Joi.string().required(),
    'debug': Joi.boolean().optional(),
    'test': Joi.string().optional()
});

const payloadSchema = Joi.object({
    north: Joi.number().greater(-90.0).less(90.0),
    south: Joi.number().greater(-90.0).less(90.0),
    west: Joi.number().greater(-180.0).less(180.0),
    east: Joi.number().greater(-180.0).less(180.0)
});

module.exports = {
  // [Route:]
  // [Description:]
  // [Header: token]
  // [Header: rollback , default is false]
  method: 'POST',
  path: '/adoptee/mbr',
  handler: async function (req) {
    /* $lab:coverage:off$ */
    // [Define a /adoptees/mbr POST route handler]
    
    let result = {status:"200", msg:"OK"};
    let client = req.pg || false;
    
    const token = `("${req.headers.authorization.replace('Bearer ','')}")`;

    const form = req.payload; // MBR
    const mbr = `(${form.north},${form.south},${form.west},${form.east})`;

    const apiDebug = req.headers.debug || false;
    let apiTest = req.headers.test || false; // convert from string

    try {  
      if (apiTest) {
        // [Optionally insert a test user when test in header]
        await client.query('BEGIN'); // start transaction to rollback test data
        let function_name = 'adoptee';
        let testHelper = new TestHelper(client, function_name);
        apiTest = JSON.parse(apiTest);
        await testHelper.post(apiTest.data, apiTest.owners); // post array of test data
      }

      const res = await client.query(
        {
          text: 'select * from api_0_0_1.adoptee($1::TOKEN,$2::MBR)',
          values: [token,
                   mbr]
        }
      );
      result = res.rows[0].adoptee;
    } catch (err) {
      // [Catch any exceptions]
      result.status = '500';
      result.msg = 'Unknown Error';
      result['error'] = err;
      console.error('/adoptees/mbr err',err);    
    } finally {
      // [Release client back to pool]
      if (client) {client.release();}
      new ApiDebug('adoptees', apiDebug).show(req.headers, req.payload, result);
      // [Return {status, msg, token}]
      // eslint-disable-next-line no-unsafe-finally
      return result;
       
    }
    /* $lab:coverage:on$ */ 
  },
  options: {
        cors: {
            origin: JSON.parse(process.env.ACCEPTED_ORIGINS),
            headers:['Authorization', 'Content-Type'],
            exposedHeaders: ['Accept'],
        },
        description: 'Adoptee with Guest Token',
        notes: 'adoptee/mbr --> adoptee(token, mbr)',
        tags: ['api','adoptees'],
        auth: {
          mode: 'required',
          strategy: 'lb_jwt_strategy',
          access: {
            scope: ['api_guest']
          }
        },
        validate: {
          headers: headerSchema.unknown(),
          payload: payloadSchema,
          /*
          failAction: async (request, h, err) => {
            if (process.env.NODE_ENV === 'production') {
              // In prod, log a limited error message and throw the default Bad Request error.
              console.error('ValidationError:', err.message);
              // throw Boom.badRequest(`Invalid request payload input`);
            } else {
              // During development, log and respond with the full error.
              console.error(err);
              throw err;
            }
          }
          */
        },
        
        // response: {
        //    schema: Joi.array().items(payloadSchema),
        //    failAction: async (request, h, err) => {
        //      console.log(err);
        //      throw err;
        //    }
        // }
    }
};
