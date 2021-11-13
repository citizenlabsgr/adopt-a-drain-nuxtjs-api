'use strict';

const Step = require('../../lib/runner/step');
module.exports = class FunctionCreateValidateTokenTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'validate_token';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.jwt_secret = `${this.kind}_${this.version}.get_jwt_secret()`;
    this.claims = `${this.kind}_${this.version}.get_jwt_claims('guest', 'api_guest', '0')`;
    this.guest_token = `${this.kind}_${this.version}.sign(${this.claims}::JSON, ${this.jwt_secret}::TEXT)`;
  
    this.jwt_claims_user = `${this.kind}_${this.version}.get_jwt_claims('signup@user.com','api_user','0')`;
    this.user_token = `${this.kind}_${this.version}.sign(${this.jwt_claims_user}::JSON, ${this.jwt_secret}::TEXT)::TEXT`; 
    
    this.jwt_claims_admin = `${this.kind}_${this.version}.get_jwt_claims('signup@user.com','api_admin','0')`;
    this.admin_token = `${this.kind}_${this.version}.sign(${this.jwt_claims_admin}::JSON, ${this.jwt_secret}::TEXT)::TEXT`; 
    
    
    this.sql = `BEGIN;

    SELECT plan(3);
  
    SELECT has_function(
        '${this.kind}_${this.version}',
        'validate_token',
        ARRAY[ 'TOKEN', 'TEXT' ],
        'DB Function validate_token(token)'
    );
  
    -- 2 validate_ token guest
    
    SELECT is (
  
      ${this.kind}_${this.version}.validate_token(
        
        ${this.guest_token}::TOKEN,
        'api_guest'::TEXT
  
      )::JSONB,
  
      '{"aud": "citizenlabs-api", "iss": "citizenlabs", "key": "0", "sub": "client-api", "user": "guest", "scope": "api_guest"}'::JSONB,
  
      'DB Good token true 0_0_1'::TEXT
  
    );
  
    -- 3 validate_ token user
    
    SELECT is (
  
      ${this.kind}_${this.version}.validate_token(
        
        ${this.user_token}::TOKEN,
        'api_user'::TEXT
  
      )::JSONB,
  
      '{"aud": "citizenlabs-api", "iss": "citizenlabs", "key": "0", "sub": "client-api", "user": "signup@user.com", "scope": "api_user"}'::JSONB,
  
      'DB Good token true 0_0_1'::TEXT
  
    );
    -- 4 validate_ token admin
    
    SELECT is (
  
      ${this.kind}_${this.version}.validate_token(
        
        ${this.admin_token}::TOKEN,
        'api_admin'::TEXT
  
      )::JSONB,
  
      '{"aud": "citizenlabs-api", "iss": "citizenlabs", "key": "0", "sub": "client-api", "user": "signup@user.com", "scope": "api_admin"}'::JSONB,
  
      'DB Good token true 0_0_1'::TEXT
  
    );
    
    SELECT * FROM finish();
  
  ROLLBACK;
    `;
    // $lab:coverage:on$ 

  }    
};