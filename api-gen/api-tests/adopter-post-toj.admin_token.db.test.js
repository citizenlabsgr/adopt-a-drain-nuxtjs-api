
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionAdopterPostTojAdminTokenTest extends Step {
        constructor(kind, version, baseVersion) {    
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: adopter
      -- chelate: 
      -- method: POST
      -- expected: 
      -- setup: 

      /* no setup */

      SELECT plan(1);

      
        /* Work-around pgtap bug with user defined types and hasFunction
        SELECT has_function(
  
            'api_0_0_1',
      
            'adopter',
      
            ARRAY[TOKEN,JSONB,OWNER_ID],
      
            'DB Function POST adopter (TOKEN,JSONB,OWNER_ID) exists'
      
        );
        */
        
        SELECT is (
            (api_0_0_1.adopter(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"adopter@user.com","scope":"api_admin","key":"duckduckgoose"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'("duckduckgoose")'::OWNER_ID
              ,'{"username":"adopter@user.com","displayname":"J","scope":"api_user","password":"$2a$06$TXVF4CDfUcHXvTeOIGrEn.BSGbbCzLxMu2t8tyZimKtsBRxxyeQBK"}'::JSONB
            )::JSONB - 'insertion'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB adopter(TOKEN,JSONB,OWNER_ID) POST api_admin 200 0_0_1'::TEXT
        
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            