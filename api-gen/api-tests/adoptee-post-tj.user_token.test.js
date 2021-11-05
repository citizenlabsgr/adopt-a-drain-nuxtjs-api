
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionAdopteePostTjUserTokenTest extends Step {
        constructor(kind, version, baseVersion) {    
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: adoptee
      -- chelate: 
      -- method: POST
      -- expected: 
      -- setup: 

      /* no setup */

      SELECT plan(2);

      
        /* Work-around pgtap bug with user defined types and hasFunction
        SELECT has_function(
  
            'api_0_0_1',
      
            'adoptee',
      
            ARRAY[TOKEN,JSON,OWNER_ID],
      
            'DB Function POST adoptee (TOKEN,JSON,OWNER_ID) exists'
      
        );
        */
        
        SELECT is (
            (api_0_0_1.adoptee(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_user","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'{"lat":42.9688029487,"lon":-85.6761931983,"name":"abc","type":"adoptee","drain_id":"GR_40107671","adopter_key":"duckduckgoose"}'::JSON
              ,'("duckduckgoose")'::OWNER_ID
            )::JSONB - 'insertion'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB adoptee POST 200 0_0_1'::TEXT
        
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            