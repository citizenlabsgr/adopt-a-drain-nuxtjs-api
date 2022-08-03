
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionPagePutToijAdminTokenTest extends Step {
        constructor(kind, version, baseVersion) {
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: page
      -- chelate: 
      -- method: PUT
      -- expected: 
      -- setup: 

      
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'page_id#testppage',
            'name#title',
            'value#test-page',
            '{"page_id":"testpage","name":"title","value":"Test-Page"}'::JSONB,
            'duckduckgoose'
        );
        
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'page_id#testppage',
            'name#subtitle',
            'value#test-test-test',
            '{"page_id":"testpage","name":"subtitle","value":"test-test-test"}'::JSONB,
            'duckduckgoose'
        );
        
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'page_id#testppage',
            'name#description',
            'value#once-upon-a-time',
            '{"page_id":"testpage","name":"description","value":"Once-upon-a-time"}'::JSONB,
            'duckduckgoose'
        );
        

      SELECT plan(3);

      
        /* Work-around pgtap bug with user defined types and hasFunction
        SELECT has_function(
  
            'api_0_0_0',
      
            'page',
      
            ARRAY[TOKEN,OWNER_ID,IDENTITY,JSONB],
      
            'DB Function PUT page (TOKEN,OWNER_ID,IDENTITY,JSONB) exists'
      
        );
        */
        
        SELECT is (
            (api_0_0_0.page(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("testppage")'::IDENTITY
              ,'{"page_id":"testpage","name":"title","value":"Test-Page"}'::JSONB
            )::JSONB - 'updation'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB page(TOKEN,OWNER_ID,IDENTITY,JSONB) PUT api_admin 200 0_0_1'::TEXT
        
          );
        
        SELECT is (
            (api_0_0_0.page(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("testppage")'::IDENTITY
              ,'{"page_id":"testpage","name":"subtitle","value":"test-test-test"}'::JSONB
            )::JSONB - 'updation'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB page(TOKEN,OWNER_ID,IDENTITY,JSONB) PUT api_admin 200 0_0_1'::TEXT
        
          );
        
        SELECT is (
            (api_0_0_0.page(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("testppage")'::IDENTITY
              ,'{"page_id":"testpage","name":"description","value":"Once-upon-a-time"}'::JSONB
            )::JSONB - 'updation'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB page(TOKEN,OWNER_ID,IDENTITY,JSONB) PUT api_admin 200 0_0_1'::TEXT
        
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            