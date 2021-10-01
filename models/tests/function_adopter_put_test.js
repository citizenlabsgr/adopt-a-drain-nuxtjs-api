'use strict';

const Step = require('../../lib/runner/step');
module.exports = class FunctionAdopterPutTest extends Step {
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
  
    this.guest_token = `${this.baseKind}_${this.baseVersion}.sign(${this.jwt_claims_guest}::JSON, ${this.jwt_secret}::TEXT)::TEXT`;
    this.user_token = `${this.baseKind}_${this.baseVersion}.sign(${this.jwt_claims_user}::JSON, ${this.jwt_secret}::TEXT)::TEXT`;

 
    this.sql = `BEGIN;
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

    SELECT plan(4);
 
  
    -- 1 Update
  
    SELECT has_function(
  
        '${this.kind}_${this.version}',
  
        'adopter',
  
        ARRAY[ 'TEXT', 'TEXT', 'JSON'],
  
        'DB Function adopter PUT (text, text, json) exists'
  
    );
  
    -- 2 change non-key
    
    SELECT is (
  
      (${this.kind}_${this.version}.adopter(
        ${this.user_token},
        'update@user.com'::TEXT,
        '{"username":"update@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON
      )::JSONB - 'updation'),
  
      '{"msg":"OK","status":"200"}'::JSONB,
  
      'DB adopter PUT update displayname 200 0_0_1'::TEXT
  
    );
    
    
    -- 3 change pk
    
    SELECT is (
  
      (${this.kind}_${this.version}.adopter(
        ${this.user_token},
        'update@user.com'::TEXT,
        '{"username":"update2@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON
      )::JSONB - 'updation'),
  
      '{"msg":"OK","status":"200"}'::JSONB,
  
      'DB adopter PUT update username 200 0_0_1'::TEXT
  
    );
    
    -- 4 change password
    
    SELECT is (
  
      (${this.kind}_${this.version}.adopter(
        ${this.user_token},
        'update2@user.com'::TEXT,
        '{"username":"update2@user.com","displayname":"J","password":"b1B!bbbb"}'::JSON
      )::JSONB  - 'updation'),
  
      '{"msg":"OK","status":"200"}'::JSONB,
  
      'DB adopter PUT update password 200 0_0_1'::TEXT
  
    );
    
    /*
    SELECT is (
  
      ${this.kind}_${this.version}.signup(
  
        NULL::TEXT,
  
        NULL::JSON
  
      )::JSONB ->> 'status' = '403',
  
      true::Boolean,
  
      'DB Signup Insert (NULL,NULL) 403 0_0_1'::TEXT
  
    );
  
  -- 3
  
  SELECT is (
    ${this.kind}_${this.version}.signup(
    ${this.guest_token},
      NULL::JSON
    )::JSONB,
    '{"msg": "Bad Request", "status": "400"}'::JSONB,
    'DB Signup Insert (guest_token,NULL) 400 0_0_1'::TEXT
  );
  
    -- 4
  
    SELECT is (
  
      ${this.kind}_${this.version}.signup(
  
      ${this.guest_token},
  
        NULL::JSON
  
      )::JSONB,
  
      '{"msg": "Bad Request", "status": "400"}'::JSONB,
  
      'DB Signup Insert (guest_token,NULL) 400 0_0_1'::TEXT
  
    );
  
    -- 5
  
    SELECT is (
  
      ${this.kind}_${this.version}.signup(
  
      ${this.guest_token},
  
      '{}'::JSON
  
      )::JSONB,
  
       '{"msg": "Bad Request", "status": "400"}'::JSONB,
  
      'DB Signup Insert (guest_token,NULL) 400 0_0_1'::TEXT
  
    );
  
    -- 6
  
    SELECT is (
  
      (${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"username":"signup@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON
  
      )::JSONB - 'insertion'),
  
      '{"msg":"OK","status":"200"}'::JSONB,
  
      'DB Signup Insert OK 200 0_0_1'::TEXT
  
    );
  
    -- 7
  
    SELECT is (
  
      (${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"username":"signup@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON
  
      )::JSONB ),
  
      '{"msg":"Duplicate","status":"409"}'::JSONB,
  
      'DB Signup Insert duplicate 409 0_0_1'::TEXT
  
    );
  
    -- 8
  
    SELECT is (
  
      ${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"displayname":"J","password":"a1A!aaaa"}'::JSON
  
      )::JSONB,
  
      '{"msg":"Bad Request","status":"400"}'::JSONB,
  
      'DB Signup Insert 400 0_0_1'::TEXT
  
    );
  
    -- 9
  
    SELECT is (
  
      ${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"username":"signup@user.com","displayname":"J"}'::JSON
  
      )::JSONB ->> 'status' = '400',
  
      true::Boolean,
  
      'DB Signup Insert 400 0_0_1'::TEXT
  
    );
  
    -- 10
  
    SELECT is (
  
      (${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"username":"signup2@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON
  
      )::JSONB - 'insertion'),
  
      '{"msg":"OK","status":"200"}'::JSONB,
  
      'DB Signup Insert  200 0_0_1'::TEXT
  
    );
  
    -- 11
  
    SELECT is (
  
      (${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"username":"signup3@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON,
  
        'duckduckgoose'
  
      )::JSONB - 'insertion'),
  
      '{"msg":"OK","status":"200"}'::JSONB,
  
      'DB Signup Insert 200 0_0_1'::TEXT
  
    );
  
    -- 12
  
    SELECT is (
  
      ${this.kind}_${this.version}.signup(
  
        ${this.guest_token},
  
        '{"username":"signup1@user.com","displayname":"J","password":"a1A!aaaa"}'::JSON
  
      )::JSONB - 'insertion'::TEXT,
  
      '{"msg": "OK", "status": "200"}'::JSONB,
  
      'DB Signup Insert 401 0_0_1'::TEXT
  
    );
    */

    SELECT * FROM finish();

  ROLLBACK;
    `;
    // console.log('signup test', this.sql);
    // $lab:coverage:on$
  }    
  
};