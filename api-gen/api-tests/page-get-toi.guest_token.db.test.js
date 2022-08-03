
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionPageGetToiGuestTokenTest extends Step {
        constructor(kind, version, baseVersion) {
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: page
      -- chelate: 
      -- method: GET
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
      
            ARRAY[TOKEN,OWNER_ID,IDENTITY],
      
            'DB Function GET page (TOKEN,OWNER_ID,IDENTITY) exists'
      
        );
        */
        
          SELECT is (
  
            (api_0_0_0.page(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"guest","scope":"api_guest","key":"0"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("testppage")'::IDENTITY
              
              
              
            )::JSONB - 'selection'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB page(TOKEN,OWNER_ID,IDENTITY) GET api_guest 200 0_0_1'::TEXT
          );
        
          SELECT is (
  
            (api_0_0_0.page(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"guest","scope":"api_guest","key":"0"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("testppage")'::IDENTITY
              
              
              
            )::JSONB - 'selection'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB page(TOKEN,OWNER_ID,IDENTITY) GET api_guest 200 0_0_1'::TEXT
          );
        
          SELECT is (
  
            (api_0_0_0.page(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"guest","scope":"api_guest","key":"0"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("testppage")'::IDENTITY
              
              
              
            )::JSONB - 'selection'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB page(TOKEN,OWNER_ID,IDENTITY) GET api_guest 200 0_0_1'::TEXT
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            