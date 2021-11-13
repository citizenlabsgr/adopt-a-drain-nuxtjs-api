
    'use strict';
    // this file was generated
    const Step = require('../../lib/runner/step.js');
    module.exports = class FunctionSignupPostGuestTokenTest extends Step {
        constructor(kind, version, baseVersion) {    
            super(kind, version);
            this.baseVersion = baseVersion;
            this.sql = `
    BEGIN;
      -- token : token
      -- function: signup
      -- chelate: 
      -- method: POST
      -- expected: 
      -- setup: 

      /* no setup */

      SELECT plan(2);

      
        /* Work-around pgtap bug with user defined types and hasFunction
        SELECT has_function(
  
            'api_0_0_1',
      
            'signup',
      
            ARRAY[TOKEN,JSONB],
      
            'DB Function POST signup (TOKEN,JSONB) exists'
      
        );
        */
        
        SELECT is (
            (api_0_0_1.signup(
              base_0_0_1.sign('{"aud":"citizenlabs-api","iss":"citizenlabs","sub":"client-api","user":"guest","scope":"api_guest","key":"0"}'::JSON, base_0_0_1.get_jwt_secret()::TEXT)::TOKEN
              ,'{"username":"adopter@user.com","displayname":"J","scope":"api_user","password":"a1A!aaaa"}'::JSONB
              
            )::JSONB - 'insertion'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB signup POST 200 0_0_1'::TEXT
        
          );
        
      
      SELECT * FROM finish();
    ROLLBACK;
    `;
        }
    };
            