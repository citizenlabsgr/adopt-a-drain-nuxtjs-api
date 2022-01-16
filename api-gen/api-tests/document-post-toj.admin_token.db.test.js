
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionDocumentPostTojAdminTokenTest extends Step {
        constructor(kind, version, baseVersion) {
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: document
      -- chelate: 
      -- method: POST
      -- expected: 
      -- setup: 

      /* no setup */

      SELECT plan(2);

      
        /* Work-around pgtap bug with user defined types and hasFunction
        SELECT has_function(
  
            'api_0_0_1',
      
            'document',
      
            ARRAY[TOKEN,OWNER_ID,JSONB],
      
            'DB Function POST document (TOKEN,OWNER_ID,JSONB) exists'
      
        );
        */
        
        SELECT is (
            (api_0_0_1.document(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'{"doc_id":"tou","p":0,"i":"00000","w":"Terms-of-Use"}'::JSONB
            )::JSONB - 'insertion'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB document(TOKEN,OWNER_ID,JSONB) POST api_admin 200 0_0_1'::TEXT
        
          );
        
        SELECT is (
            (api_0_0_1.document(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'{"doc_id":"tou","p":1,"i":"00001","w":"TOU"}'::JSONB
            )::JSONB - 'insertion'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB document(TOKEN,OWNER_ID,JSONB) POST api_admin 200 0_0_1'::TEXT
        
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            