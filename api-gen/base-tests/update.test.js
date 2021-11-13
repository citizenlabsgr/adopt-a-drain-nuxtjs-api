'use strict';

const Step = require('../../lib/runner/step');
module.exports = class FunctionUpdateTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'update';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `BEGIN;
    insert into ${this.kind}_${this.version}.one
      (pk, sk, tk, form, owner)
      values (
          'username#adopter@user.com',
          'const#USER',
          'guid#820a5bd9-e669-41d4-b917-81212bc184a3',
          '{"username":"adopter@user.com",
                  "displayname":"J",
                  "scope":"api_user",
                  "password": "$2a$06$TXVF4CDfUcHXvTeOIGrEn.BSGbbCzLxMu2t8tyZimKtsBRxxyeQBK"
           }'::JSONB,
          'duckduckgoose'
      );
    
      SELECT plan(12);
    
      -- 1
    
      SELECT has_function(
          '${this.kind}_${this.version}',
          'update',
          ARRAY[ 'JSONB','OWNER_ID' ],
          'DB Function Update (_chelate JSONB,OWNER_ID) exists'
      );
    
      --  2
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "form":{"username":"adopter@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          '("duckduckgoose")'::OWNER_ID)::JSONB ->> 'msg',
    
          'Bad Request'::TEXT,
    
          'DB Update Bad no keys form Bad Request 0_0_1'::TEXT
    
      );
    
      -- 3
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form":{"username":"adopter@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          '("duckduckgoose")'::OWNER_ID)::JSONB ->> 'msg',
    
          'Bad Request'::TEXT,
    
          'DB Update Bad tk only form Bad Request 0_0_1'::TEXT
    
      );
    
      -- 4
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "sk":"const#USER",
    
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form":{"username":"adopter@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          '("duckduckgoose")'::OWNER_ID)::JSONB ->> 'msg',
    
          'Bad Request'::TEXT,
    
          'DB Update Bad sk tk form Bad Request 0_0_1'::TEXT
    
      );
    
      -- 5
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "pk":"username#adopter@user.com",
    
          "sk":"const#USER",
    
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3"
    
          }'::JSONB,
    
          '("duckduckgoose")'::OWNER_ID)::JSONB ->> 'msg',
    
          'Bad Request'::TEXT,
    
          'DB Update Bad pk sk tk NO form Bad Request 0_0_1'::TEXT
    
      );
    
      -- 6
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "pk":"username#unknown@user.com",
    
          "sk":"const#USER",
    
          "tk":"guid#unknown820a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form":{"username":"unknown@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          '("duckduckgoose")'::OWNER_ID)::JSONB ->> 'msg',
    
          'Not Found'::TEXT,
    
          'DB Update Bad pk sk tk form PK Not Found 0_0_1'::TEXT
    
      );
    
      -- 7
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "pk":"username#unknown@user.com",
    
          "sk":"const#USER",
    
          "tk":"guid#unknown820a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form":{"username":"unknown@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          '("duckduckgoose")'::OWNER_ID)::JSONB ->> 'msg',
    
          'Not Found'::TEXT,
    
          'DB Update Bad badpk sk tk form PK Not Found 0_0_1'::TEXT
    
      );
 
      -- 8 Not Found with a change
    
      SELECT is (
    
        ${this.kind}_${this.version}.update('{
    
          "pk":"username#unknown@user.com",
    
          "sk":"const#USER",
    
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form": {
    
              "username":"update2@user.com",
    
              "displayname":"J",
    
              "const":"USER",
    
              "guid":"820a5bd9-e669-41d4-b917-81212bc184a3"
    
            }
    
          }'::JSONB,
    
          '("unknownOwner")')::JSONB ->> 'msg',
    
          'Not Found'::TEXT,
    
          'DB Update Not Found with Change  0_0_1'::TEXT
    
      );
    
    
    
      -- 9 No change
    
    
    
      SELECT is (
    
        (${this.kind}_${this.version}.update('{
    
          "pk":"username#adopter@user.com",
    
          "sk":"const#USER",
    
          "tk":"guid#820a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form": {
    
              "username":"adopter@user.com",
    
              "displayname":"J",
    
              "const":"USER",
    
              "guid":"820a5bd9-e669-41d4-b917-81212bc184a3"
    
            }
    
          }'::JSONB,
    
          '("duckduckgoose")'::OWNER_ID)::JSONB - 'updation'),
    
          '{"msg":"OK","status":"200"}'::JSONB,
    
          'DB Update No change OK  0_0_1'::TEXT
    
      );
    
    
    
      -- 10 Form change OK
    /*
     SELECT is (
    
       ${this.kind}_${this.version}.update(
    
           '{
    
             "pk":"username#adopter@user.com",
    
             "sk":"const#USER",
    
             "tk":"guid#d820a5bd9-e669-41d4-b917-81212bc184a3",
    
             "form":{
    
                     "username":"adopter@user.com",
    
                     "displayname":"K",
    
                     "const":"USER",
    
                     "guid":"820a5bd9-e669-41d4-b917-81212bc184a3"
    
                   }
    
            }'::JSONB,
    
            '("duckduckgoose")'::OWNER_ID
    
         )::JSONB ->> 'msg',
    
         'OK'::TEXT,
    
         'DB Update displayname change OK  0_0_1'::TEXT
    
     );
    
    
    
     -- 11  Single Key Change only
    
     SELECT is (
    
       ${this.kind}_${this.version}.update(
    
         '{
    
           "pk":"username#adopter@user.com",
    
           "sk":"const#USER",
    
           "tk":"guid#d820a5bd9-e669-41d4-b917-81212bc184a3",
    
           "form":{
    
                   "username":"CHANGEadopter@user.com",
    
                   "displayname":"J",
    
                   "const":"USER",
    
                   "guid":"820a5bd9-e669-41d4-b917-81212bc184a3"
    
                 }
    
          }'::JSONB,
    
          '("duckduckgoose")'::OWNER_ID
    
         )::JSONB ->> 'msg',
    
         'OK'::TEXT,
    
         'DB Update pk key change OK  0_0_1'::TEXT
    
     );
     
    
     --  12 Multiple Key Change
    
     SELECT is (
    
       ${this.kind}_${this.version}.update(
    
         '{
    
           "pk":"username#adopter@user.com",
    
           "sk":"const#USER",
    
           "tk":"guid#d820a5bd9-e669-41d4-b917-81212bc184a3",
    
           "form":{
    
                   "username":"CHANGEadopter@user.com",
    
                   "displayname":"J",
    
                   "const":"CHANGETEST",
    
                   "guid":"820a5bd9-e669-41d4-b917-81212bc184a3"
    
                 }
    
          }'::JSONB,
    
          '("duckduckgoose")'::OWNER_ID
    
         )::JSONB ->> 'msg',
    
         'Not Found'::TEXT,
    
         'DB Update, DOUBLE PUMP on an update 0_0_1'::TEXT
    
     );
    */
      SELECT * FROM finish();
    
    ROLLBACK;
    `;
    // $lab:coverage:on$
  }    
};