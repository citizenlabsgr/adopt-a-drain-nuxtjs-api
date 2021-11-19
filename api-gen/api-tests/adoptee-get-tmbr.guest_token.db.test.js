
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionAdopteeGetTmbrGuestTokenTest extends Step {
        constructor(kind, version, baseVersion) {    
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: adoptee
      -- chelate: 
      -- method: GET
      -- expected: 
      -- setup: 

      
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'drain_id#gr_40107671',
            'const#ADOPTEE',
            'guid#820a5bd9-e669-41d4-b917-81212bc184a3',
            '{"lat":1,"lon":1,"name":"abc","type":"adoptee","drain_id":"GR_40107671","adopter_key":"duckduckgoose"}'::JSONB,
            'duckduckgoose'
        );
        

      SELECT plan(1);

      
        /* Work-around pgtap bug with user defined types and hasFunction
        SELECT has_function(
  
            'api_0_0_1',
      
            'adoptee',
      
            ARRAY[TOKEN,MBR],
      
            'DB Function GET adoptee (TOKEN,MBR) exists'
      
        );
        */
        
          SELECT is (
  
            (api_0_0_1.adoptee(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"guest","scope":"api_guest","key":"0"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              
              
              
              ,'(2,0,0,2)'::MBR
              
            )::JSONB - 'selection'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB adoptee(TOKEN,MBR) GET api_guest 200 0_0_1'::TEXT
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            