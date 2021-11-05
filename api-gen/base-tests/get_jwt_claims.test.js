'use strict';

const Step = require('../../lib/runner/step');
module.exports = class FunctionGetJwtClaimsTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'get_jwt_claims';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `BEGIN;

    SELECT plan(3);
  
    SELECT has_function(
        '${this.kind}_${this.version}',
        'get_jwt_claims',
        ARRAY[ 'TEXT', 'TEXT', 'TEXT' ],
        'DB Function get_jwt_claims(user, scope, key)'
    );
  
    -- 2 
    
    SELECT is (
  
      ${this.kind}_${this.version}.get_jwt_claims(
        'claims@claims.com'::TEXT,
        'api_guest'::TEXT,
        '0'::TEXT
      )::JSONB,
  
      '{"aud": "citizenlabs-api", "iss": "citizenlabs", "key": "0", "sub": "client-api", "user": "claims@claims.com", "scope": "api_guest"}'::JSONB,
  
      'DB get_jwt_claims (user, scope, key)'::TEXT
  
    );
    -- 3 
    SELECT is (
  
      ${this.kind}_${this.version}.get_jwt_claims(
        'claims@claims.com'::TEXT,
        'api_user'::TEXT,
        'duckduckgoose'::TEXT
      )::JSONB,
  
      '{"aud": "citizenlabs-api", "iss": "citizenlabs", "key": "duckduckgoose", "sub": "client-api", "user": "claims@claims.com", "scope": "api_user"}'::JSONB,
  
      'DB get_jwt_claims (user, scope, key)'::TEXT
  
    );
  
    SELECT * FROM finish();
  
  ROLLBACK;
    `;
    // $lab:coverage:on$
  }    
};