
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionPagePostTojAdminTokenTest extends Step {
        constructor(kind, version, baseVersion) {
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: page
      -- chelate: 
      -- method: POST
      -- expected: 
      -- setup: 

      /* no setup */

      SELECT plan(3);

      
        /* Work-around pgtap bug with user defined types and hasFunction
        SELECT has_function(
  
            'api_0_0_0',
      
            'page',
      
            ARRAY[TOKEN,OWNER_ID,JSONB],
      
            'DB Function POST page (TOKEN,OWNER_ID,JSONB) exists'
      
        );
        */
        
        SELECT is (
            (api_0_0_0.page(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'{"page_id":"testpage","name":"title","value":"Test-Page"}'::JSONB
            )::JSONB - 'insertion'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB page(TOKEN,OWNER_ID,JSONB) POST api_admin 200 0_0_1'::TEXT
        
          );
        
        SELECT is (
            (api_0_0_0.page(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'{"page_id":"testpage","name":"subtitle","value":"test-test-test"}'::JSONB
            )::JSONB - 'insertion'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB page(TOKEN,OWNER_ID,JSONB) POST api_admin 200 0_0_1'::TEXT
        
          );
        
        SELECT is (
            (api_0_0_0.page(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'{"page_id":"testpage","name":"description","value":"Once-upon-a-time"}'::JSONB
            )::JSONB - 'insertion'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB page(TOKEN,OWNER_ID,JSONB) POST api_admin 200 0_0_1'::TEXT
        
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            