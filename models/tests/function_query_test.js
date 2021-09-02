'use strict';

const Step = require('../../lib/runner/step');
module.exports = class FunctionQueryTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'query';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    // this.criteria =  '{"sk": "const#ADOPTEE", "tk": "*", "mbr":{"west": 0.0, "east": 2.0, "north": 2.0, "south": 0.0}}';

    this.sql = `BEGIN;
    -- set the key after insert
    
    insert into ${this.kind}_${this.version}.one (pk,sk,form,owner) values ('username#query@user.com', 'const#USER', '{"username":"query@user.com","sk":"const#USER"}'::JSONB, 'queryOwner' );
    
    insert into ${this.kind}_${this.version}.one (pk,sk,tk,form,owner) values ('username#query1@user.com', 'const#USER', 'query1Owner','{"username":"query1@user.com","sk":"const#USER"}'::JSONB, 'query1Owner' );
    
    insert into ${this.kind}_${this.version}.one (pk,sk,form,owner) values ('username#query2@user.com', 'const#USER', '{"username":"query2@user.com","sk":"const#USER"}'::JSONB, 'query2Owner' );
    
    insert into ${this.kind}_${this.version}.one (pk, sk, tk, form, owner) values ('one', 'const#ADOPTEE', 'one', '{"name":"One", "drain_id":"One","lat":1.0, "lon":1.0}'::JSONB, 'duckduckgoose'); 

    insert into ${this.kind}_${this.version}.one (pk, sk, tk, form, owner) values ('two', 'const#ADOPTEE', 'two', '{"name":"Two", "drain_id":"Two","lat":2.0, "lon":2.0}'::JSONB, 'duckduckgoose'); 

    insert into ${this.kind}_${this.version}.one (pk, sk, tk, form, owner) values ('three', 'const#ADOPTEE', 'three', '{"name":"Three", "drain_id":"Three","lat":3.0, "lon":3.0}'::JSONB, 'duckduckgoose'); 

    
      SELECT plan(16);
    
      -- 1
    
      SELECT has_function(
    
          '${this.kind}_${this.version}',
    
          'query',
    
          ARRAY[ 'JSONB' ],
    
          'Function query (json) should exist'
    
      );
      
      -- 2 pk
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":"*"}'::JSONB),
    
        '{"msg": "Bad Request", "extra": "C42703", "status": "400", "criteria": {"pk": "*"}}'::JSONB,
    
        'query pk=* 400 0_0_1'::TEXT
    
      );
    
      -- 3
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":"*"}'::JSONB),
    
        '{"msg": "Bad Request", "extra": "C42703", "status": "400", "criteria": {"sk": "*"}}'::JSONB,
    
        'query sk=* 400 0_0_1'::TEXT
    
      );
    
      -- 4
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"tk":"*"}'::JSONB),
    
        '{"msg": "Bad Request", "extra": "C42703", "status": "400", "criteria": {"tk": "*"}}'::JSONB,
    
        'query tk=* 400 0_0_1'::TEXT
    
      );
    
      -- 5
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":""}'::JSONB),
    
        '{"msg": "Bad Request", "extra": "C42703", "status": "400", "criteria": {"pk": ""}}'::JSONB,
    
        'query pk="" 400 0_0_1'::TEXT
    
      );
    
      -- 6
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":""}'::JSONB),
    
        '{"msg": "Bad Request", "extra": "C42703", "status": "400", "criteria": {"sk": ""}}'::JSONB,
    
        'query sk="" 400 0_0_1'::TEXT
    
      );
    
      -- 7
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"tk":""}'::JSONB),
    
        '{"msg": "Bad Request", "extra": "C42703", "status": "400", "criteria": {"tk": ""}}'::JSONB,
    
        'query tk="" 400 0_0_1'::TEXT
    
      );
    
      -- 8
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":"","sk":"*"}'::JSONB),
    
        '{"msg": "Not Found", "status": "404", "criteria": {"pk": "", "sk": "*"}}'::JSONB,
    
        'query pk="" sk="*" 404 0_0_1'::TEXT
    
      );
    
      -- 9
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":"","tk":""}'::JSONB),
    
        '{"msg": "Not Found", "status": "404", "criteria": {"sk": "", "tk": ""}}'::JSONB,
    
        'query sk="" tk="" 404 0_0_1'::TEXT
    
      );
    
      -- 10 pk sk
    
    
    
      SELECT ok (
    
        ${this.kind}_${this.version}.query('{"pk":"username#query@user.com", "sk":"const#USER"}'::JSONB) ->> 'msg' = 'OK',
    
        'query pk sk good 0_0_1'::TEXT
    
      );
    
    
    
      -- 11 pk sk=*
    
    
    
      SELECT ok (
    
        ${this.kind}_${this.version}.query('{
    
          "pk":"username#query@user.com",
    
          "sk":"*"}'::JSONB)::JSONB ->> 'msg' = 'OK',
    
        'query pk sk:* good 0_0_1'::TEXT
    
      );
    
    
    
      -- 12 sk tk
    
    
    
      SELECT is (
    
        (${this.kind}_${this.version}.query('{
    
          "sk":"const#USER",
    
          "tk": "query1Owner"}'::JSONB)::JSONB - 'selection'),
    
          '{"msg": "OK", "status": "200"}'::JSONB,
    
        'query sk tk has selection is OK 0_0_1'::TEXT
    
      );
    
    
    
      -- 13 sk tk=*
    
    
    
      SELECT is (
    
        (${this.kind}_${this.version}.query('{
    
          "sk":"const#USER",
    
          "tk": "*"}'::JSONB)::JSONB - 'selection'),
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'query sk tk:* good 0_0_1'::TEXT
    
      );
    
    
    
      -- 14 xk yk
    
    
    
      SELECT is (
    
        (${this.kind}_${this.version}.query('{
    
          "xk":"const#USER",
    
          "yk": ""}'::JSONB)::JSONB ),
    
        '{"msg": "Not Found", "status": "404", "criteria": {"xk": "const#USER", "yk": ""}}'::JSONB,
    
        'query xk yk bad 404 0_0_1'::TEXT
    
      );
    
    
    
      -- 15 xk yk=*
    
      -- where tk = criteria ->> 'xk'
    
    
    
      SELECT is (
    
        (${this.kind}_${this.version}.query('{
    
          "xk":"query1Owner",
    
          "yk": "*"}'::JSONB)::JSONB  - 'selection'),
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'query xk yk=* good 0_0_1'::TEXT
    
      );

      
      -- 16 MBR
    
      SELECT is (
        
        (${this.kind}_${this.version}.query('{"sk": "const#ADOPTEE", "tk": "*", "mbr":{"west": 0.0, "east": 2.0, "north": 2.0, "south": 0.0}}'::JSONB)::JSONB - 'selection'),
        '{"msg": "OK", "status": "200"}'::JSONB,
        'query pk="" sk="*" mbr 200 0_0_1'::TEXT
    
      );
     


      SELECT * FROM finish();

    ROLLBACK;
    `;
    // console.log(this.sql);
    // $lab:coverage:on$
  }    
};