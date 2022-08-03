
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionPageDeleteToiAdminTokenTest extends Step {
        constructor(kind, version, baseVersion) {
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: page_del
      -- chelate: 
      -- method: DELETE
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
      
            'page_del',
      
            ARRAY[TOKEN,OWNER_ID,IDENTITY],
      
            'DB Function DELETE page_del (TOKEN,OWNER_ID,IDENTITY) exists'
      
        );
        */
        
          SELECT is (
  
            (api_0_0_0.page_del(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("testppage")'::IDENTITY
            )::JSONB - '{deletion,criteria}'::TEXT[]),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB page_del(TOKEN,OWNER_ID,IDENTITY) DELETE api_admin 200 0_0_1'::TEXT
          );
        
          SELECT is (
  
            (api_0_0_0.page_del(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("testppage")'::IDENTITY
            )::JSONB - '{deletion,criteria}'::TEXT[]),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB page_del(TOKEN,OWNER_ID,IDENTITY) DELETE api_admin 200 0_0_1'::TEXT
          );
        
          SELECT is (
  
            (api_0_0_0.page_del(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("testppage")'::IDENTITY
            )::JSONB - '{deletion,criteria}'::TEXT[]),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB page_del(TOKEN,OWNER_ID,IDENTITY) DELETE api_admin 200 0_0_1'::TEXT
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            