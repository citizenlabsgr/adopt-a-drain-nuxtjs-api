'use strict';

const Step = require('../../lib/runner/step');
module.exports = class FunctionAdopterPostTest extends Step {
  constructor(kind, apiVersion, baseVersion) {
    // $lab:coverage:off$
    super(kind, apiVersion);
    this.baseVersion=baseVersion;
    this.baseKind='base';
    this.name = 'adopter';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    
    this.jwt_secret = `${this.baseKind}_${this.baseVersion}.get_jwt_secret()`;
  
    this.jwt_claims_guest = `${this.baseKind}_${this.baseVersion}.get_jwt_claims('guest','api_guest','0')`;
    this.jwt_claims_user = `${this.baseKind}_${this.baseVersion}.get_jwt_claims('adopter@user.com','api_user','duckduckgoose')`;
    this.jwt_claims_admin = `${this.baseKind}_${this.baseVersion}.get_jwt_claims('adopter@user.com','api_admin','administrator')`;
  
    this.guest_token = `${this.baseKind}_${this.baseVersion}.sign(${this.jwt_claims_guest}::JSON, ${this.jwt_secret}::TEXT)::TEXT`;
    this.user_token = `${this.baseKind}_${this.baseVersion}.sign(${this.jwt_claims_user}::JSON, ${this.jwt_secret}::TEXT)::TEXT`;
    this.admin_token = `${this.baseKind}_${this.baseVersion}.sign(${this.jwt_claims_admin}::JSON, ${this.jwt_secret}::TEXT)::TEXT`;

    this.sql = `BEGIN;
    /*
    insert into base_0_0_1.one
    (pk, sk, tk, form, owner)
    values (
        'username#update@user.com',
        'const#USER',
        'guid#820a5bd9-e669-41d4-b917-81212bc184a3',
        '{"username":"update@user.com",
                "displayname":"J",
                "scope":"api_user",
                "password": "$2a$06$TXVF4CDfUcHXvTeOIGrEn.BSGbbCzLxMu2t8tyZimKtsBRxxyeQBK"
         }'::JSONB,
        'duckduckgoose'
    );
    */
    SELECT plan(4);
 
  
    -- 1 Update
  
    SELECT has_function(
  
        '${this.kind}_${this.version}',
  
        'adopter',

        ARRAY[ 'TEXT', 'JSON', 'TEXT'],
  
        'DB Function adopter POST (text, json, text) exists'
  
    );
  
    -- 2 
    
    SELECT is (
  
      (${this.kind}_${this.version}.adopter(
        ${this.admin_token},
        '{"username":"insert@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON,
        'duckduckgoose'::TEXT
      )::JSONB - 'insertion'),
  
      '{"msg":"OK","status":"200"}'::JSONB,
  
      'DB adopter POST insert@user.com 200 0_0_1'::TEXT
  
    );
    -- 3 
    
    SELECT is (
  
      (${this.kind}_${this.version}.adopter(
        ${this.admin_token},
        '{"username":"insert@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON,
        'duckduckgoose'::TEXT
      )::JSONB - 'insertion'),
  
      '{"msg":"Duplicate","status":"409"}'::JSONB,
  
      'DB adopter duplicate POST insert@user.com 200 0_0_1'::TEXT
  
    );
    

    SELECT * FROM finish();

  ROLLBACK;
    `;
    // $lab:coverage:on$
  }    
  
};