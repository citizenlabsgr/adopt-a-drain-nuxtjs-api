'use strict';

const Step = require('../../lib/runner/step');
module.exports = class FunctionInsertTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'insert';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `BEGIN;
  
      SELECT plan(9);
    
      -- 1
    
      SELECT has_function(
    
          '${this.kind}_${this.version}',
    
          'insert',
    
          ARRAY[ 'JSONB','OWNER_ID' ],
    
          'DB Function Insert (_chelate JSONB, text) exists'
    
      );
    
      --  2
    
      SELECT is (
    
        (${this.kind}_${this.version}.insert('{
    
          "sk":"const#TEST",
    
          "form":{"username":"insert1@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          '("insert1Owner")'::OWNER_ID)::JSONB - 'insertion'),
    
          '{"msg": "OK", "status": "200"}'::JSONB,
    
          'DB insert sk form good 0_0_1'::TEXT
    
      );
    
    
    
      -- 3
    
      SELECT is (
    
        ${this.kind}_${this.version}.insert('{
    
          "pk":"username#insert2@user.com",
    
          "sk":"const#TEST",
    
          "form":{"username":"insert2@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          '("insert2Owner")'::OWNER_ID)::JSONB ->> 'msg',
    
          'OK'::TEXT,
    
          'DB insert pk sk form good 0_0_1'::TEXT
    
      );
    
    
    
      -- 4
    
      SELECT is (
    
        (${this.kind}_${this.version}.insert('{
    
          "sk":"const#TEST",
    
          "tk":"username#insert22@user.com",
    
          "form":{"username":"insert22@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          '("insert22Owner")'::OWNER_ID)::JSONB - 'insertion'),
    
          '{"msg": "OK", "status": "200"}'::JSONB,
    
          'DB insert pk sk form good 0_0_1'::TEXT
    
      );
    
      -- 5
    
      SELECT is (
    
        ${this.kind}_${this.version}.insert('{
    
          "sk":"const#TEST",
    
          "tk":"guid#a920a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form":{"username":"insert3@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          '("insert3Owner")'::OWNER_ID)::JSONB ->> 'msg',
    
          'OK'::TEXT,
    
          'DB insert sk tk form good  0_0_1'::TEXT
    
      );
    
      -- 6
    
      SELECT is (
    
        ${this.kind}_${this.version}.insert('{
          "pk":"username#insert4@user.com",
          "sk":"const#TEST",
          "tk":"guid#b920a5bd9-e669-41d4-b917-81212bc184a3",
          "form":{"username":"insert4@user.com",
                  "displayname":"J",
                  "password":"a1A!aaaa"
                }
          }'::JSONB,
          '("insert4Owner")'::OWNER_ID)::JSONB - '{"form","insertion"}'::TEXT[],
    
          '{"msg": "OK", "status": "200"}'::JSONB,
          'DB insert pk sk tk form good  0_0_1'::TEXT
    
      );
    
      -- 7
    
      SELECT is (
    
        ${this.kind}_${this.version}.insert('{
    
          "pk":"username#insert4@user.com",
    
          "sk":"const#TEST",
    
          "tk":"guid#b920a5bd9-e669-41d4-b917-81212bc184a3",
    
          "form":{"username":"insert4@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          '("insert4Owner")'::OWNER_ID)::JSONB ->> 'msg',
    
          'Duplicate'::TEXT,
    
          'DB insert sk tk form, sk tk duplicte error  0_0_1'::TEXT
    
      );
    
      -- 8
    
      SELECT is (
    
        ${this.kind}_${this.version}.insert('{
    
          "form":{"username":"insert@user.com",
    
                  "displayname":"J",
    
                  "password":"a1A!aaaa"
    
                }
    
          }'::JSONB,
    
          '("insertOwner")'::OWNER_ID)::JSONB ->> 'msg',
    
          'Bad Request'::TEXT,
    
          'DB insert missing keys form good  0_0_1'::TEXT
    
      );
    
      -- 9
    
      SELECT is (
        ${this.kind}_${this.version}.insert('{
          "pk":"username#insert4@user.com",
          "sk":"const#TEST",
          "tk":"guid#b920a5bd9-e669-41d4-b917-81212bc184a3",
          "badform":{"username":"insert@user.com",
                  "displayname":"J",
                  "password":"a1A!aaaa"
                }
          }'::JSONB,
          '("insert4Owner")'::OWNER_ID)::JSONB ->> 'msg',
          'Bad Request'::TEXT,
          'DB insert pk sk tk BADform   0_0_1'::TEXT
      );
    
      SELECT * FROM finish();
    
    ROLLBACK;
    `;
    // $lab:coverage:on$
  }    
};