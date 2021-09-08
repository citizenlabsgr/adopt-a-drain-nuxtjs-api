'use strict';

const Step = require('../../lib/runner/step');
module.exports = class FunctionAdopteesTest extends Step {
  constructor(kind, apiVersion, baseVersion) {
    // $lab:coverage:off$
    super(kind, apiVersion);
    this.baseVersion=baseVersion;
    this.baseKind='base';
    this.methodName = 'adoptees';
    
    this.name = `${this.kind}_${this.version}.${this.methodName}`;

    this.jwt_claims_guest = `${this.baseKind}_${this.baseVersion}.get_jwt_claims('guest'::TEXT,'api_guest'::TEXT,'0'::TEXT)`;
    this.jwt_secret = `${this.baseKind}_${this.baseVersion}.get_jwt_secret()`;
    this.guest_token = `${this.baseKind}_${this.baseVersion}.sign(${this.jwt_claims_guest}::JSON, ${this.jwt_secret}::TEXT)::TEXT`;
    this.mbr = '{"west": 0.0, "east": 2.0, "north": 2.0, "south": 0.0}';
    this.mbr_empty = '{"west": 0.0, "east": 2.0, "north": 0.0, "south": -2.0}';

    this.sql = `BEGIN;
      insert into ${this.baseKind}_${this.baseVersion}.one (pk, sk, tk, form, owner) values ('one', 'const#ADOPTEE', 'one', '{"name":"One", "drain_id":"One","lat":1.0, "lon":1.0}'::JSONB, 'duckduckgoose'); 

      insert into ${this.baseKind}_${this.baseVersion}.one (pk, sk, tk, form, owner) values ('two', 'const#ADOPTEE', 'two', '{"name":"Two", "drain_id":"Two","lat":2.0, "lon":2.0}'::JSONB, 'duckduckgoose'); 

      insert into ${this.baseKind}_${this.baseVersion}.one (pk, sk, tk, form, owner) values ('three', 'const#ADOPTEE', 'three', '{"name":"Three", "drain_id":"Three","lat":3.0, "lon":3.0}'::JSONB, 'duckduckgoose'); 

      SELECT plan(3);
    
      -- 1
    
      SELECT has_function(
    
          '${this.kind}_${this.version}',
    
          '${this.methodName}',
    
          ARRAY[ 'TEXT', 'JSON' ],
    
          'Function ${this.name} (text, json) should exist'
    
      );

      -- 2  
      
      SELECT is (
  
        (${this.name}(
    
          ${this.guest_token},
          '${this.mbr_empty}'::JSON
    
        )::JSONB - 'criteria'),
        '{"msg": "OK", "status": "200", "selection": []}',
    
        '${this.name} 404 0_0_1'::TEXT
    
      );

      -- 3 
      
      SELECT is (
  
        (${this.name}(
    
          ${this.guest_token},
          '${this.mbr}'::JSON
    
        )::JSONB - 'selection'),
    
        '{"msg":"OK","status":"200"}'::JSONB,
    
        '${this.name} 200 0_0_1'::TEXT
    
      );

      SELECT * FROM finish();
    
    ROLLBACK;
    `;
    // console.log('sql ',this.sql);
    // $lab:coverage:on$
  }    
};
