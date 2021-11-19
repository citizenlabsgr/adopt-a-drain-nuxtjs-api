
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionAdopterGetToiAdminTokenTest extends Step {
        constructor(kind, version, baseVersion) {    
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: adopter
      -- chelate: 
      -- method: GET
      -- expected: 
      -- setup: 

      
        insert into base_0_0_1.one
        (pk, sk, tk, form, owner)
        values (
            'username#adopter@user.com',
            'const#USER',
            'guid#820a5bd9-e669-41d4-b917-81212bc184a3',
            '{"username":"adopter@user.com","displayname":"J","scope":"api_user","password":"$2a$06$TXVF4CDfUcHXvTeOIGrEn.BSGbbCzLxMu2t8tyZimKtsBRxxyeQBK"}'::JSONB,
            'duckduckgoose'
        );
        

      SELECT plan(1);

      
        /* Work-around pgtap bug with user defined types and hasFunction
        SELECT has_function(
  
            'api_0_0_1',
      
            'adopter',
      
            ARRAY[TOKEN,OWNER_ID,IDENTITY],
      
            'DB Function GET adopter (TOKEN,OWNER_ID,IDENTITY) exists'
      
        );
        */
        
          SELECT is (
  
            (api_0_0_1.adopter(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'("adopter@user.com")'::IDENTITY
              
              
              
            )::JSONB - 'selection'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB adopter(TOKEN,OWNER_ID,IDENTITY) GET api_admin 200 0_0_1'::TEXT
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            