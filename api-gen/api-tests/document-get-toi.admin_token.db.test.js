
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionDocumentGetToiAdminTokenTest extends Step {
        constructor(kind, version, baseVersion) {
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: document
      -- chelate: 
      -- method: GET
      -- expected: 
      -- setup: 

      
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'doc_id#tou',
            'i#00000',
            'w#terms-of-use',
            '{"doc_id":"tou","p":"0","i":"00000","w":"Terms-of-Use"}'::JSONB,
            'duckduckgoose'
        );
        
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'doc_id#tou',
            'i#00001',
            'w#tou',
            '{"doc_id":"tou","p":1,"i":"00001","w":"TOU"}'::JSONB,
            'duckduckgoose'
        );
        
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'doc_id#tou',
            'i#00002',
            'w##',
            '{"doc_id":"tou","p":2,"i":"00002","w":"#"}'::JSONB,
            'duckduckgoose'
        );
        
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'doc_id#tou',
            'i#00003',
            'w##',
            '{"doc_id":"tou","p":2,"i":"00003","w":"Terms"}'::JSONB,
            'duckduckgoose'
        );
        
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'doc_id#tou',
            'i#00004',
            'w#of',
            '{"doc_id":"tou","p":2,"i":"00004","w":"of"}'::JSONB,
            'duckduckgoose'
        );
        
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'doc_id#tou',
            'i#00005',
            'w#use',
            '{"doc_id":"tou","p":2,"i":"00005","w":"Use"}'::JSONB,
            'duckduckgoose'
        );
        
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'doc_id#tou',
            'i#00006',
            'w###',
            '{"doc_id":"tou","p":3,"i":"00006","w":"##"}'::JSONB,
            'duckduckgoose'
        );
        
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'doc_id#tou',
            'i#00007',
            'w#title',
            '{"doc_id":"tou","p":3,"i":"00007","w":"Title"}'::JSONB,
            'duckduckgoose'
        );
        
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'doc_id#tou',
            'i#00008',
            'w#a',
            '{"doc_id":"tou","p":3,"i":"00008","w":"A"}'::JSONB,
            'duckduckgoose'
        );
        

      SELECT plan(1);

      
        /* Work-around pgtap bug with user defined types and hasFunction
        SELECT has_function(
  
            'api_0_0_1',
      
            'document',
      
            ARRAY[TOKEN,OWNER_ID,IDENTITY],
      
            'DB Function GET document (TOKEN,OWNER_ID,IDENTITY) exists'
      
        );
        */
        
          SELECT is (

            (api_0_0_1.document(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("tou")'::IDENTITY
              
              

            )::JSONB - 'selection'),

            '{"msg":"OK","status":"200"}'::JSONB,

            'DB document(TOKEN,OWNER_ID,IDENTITY) GET api_admin 200 0_0_1'::TEXT
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            