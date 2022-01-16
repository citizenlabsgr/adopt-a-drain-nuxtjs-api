
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionDocumentDeleteToiAdminTokenTest extends Step {
        constructor(kind, version, baseVersion) {
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: document_del
      -- chelate: 
      -- method: DELETE
      -- expected: 
      -- setup: 

      
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'doc_id#tou',
            'i#00000',
            'w#terms-of-use',
            '{"doc_id":"tou","p":0,"i":"00000","w":"Terms-of-Use"}'::JSONB,
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
        

      SELECT plan(2);

      
        /* Work-around pgtap bug with user defined types and hasFunction
        SELECT has_function(
  
            'api_0_0_1',
      
            'document_del',
      
            ARRAY[TOKEN,OWNER_ID,IDENTITY],
      
            'DB Function DELETE document_del (TOKEN,OWNER_ID,IDENTITY) exists'
      
        );
        */
        
          SELECT is (
  
            (api_0_0_1.document_del(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("tou")'::IDENTITY
            )::JSONB - '{deletion,criteria}'::TEXT[]),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB document_del(TOKEN,OWNER_ID,IDENTITY) DELETE api_admin 200 0_0_1'::TEXT
          );
        
          SELECT is (
  
            (api_0_0_1.document_del(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("tou")'::IDENTITY
            )::JSONB - '{deletion,criteria}'::TEXT[]),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB document_del(TOKEN,OWNER_ID,IDENTITY) DELETE api_admin 200 0_0_1'::TEXT
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            