'use strict';
/*

DO
$BODY$

DECLARE claims_guest JSON :='{"aud":"citizenlabs-api", "iss":"citizenlabs", "sub":"client-api", "user":"guest", "scope":"api_guest", "key":"0"}';
DECLARE guest_token TEXT :=   base_0_0_1.sign(claims_guest, base_0_0_1.get_jwt_secret());
DECLARE mbr JSONB := '{"west":0.0, "east": 4.0, "north": 4.0, "south": 0.0}'::JSONB;
DECLARE chelate JSONB := '{"pk":"one","sk":"const#ADOPTEE","tk":"one","owner":"duckduckgoose"}'::JSONB;
DECLARE chelatexy JSONB := format('{"xk":"a","yk":"b","owner":"duckduckgoose","mbr":%s}','{"west":0.0, "east": 4.0, "north": 4.0, "south": 0.0}')::JSONB;

BEGIN
	-- insert into base_0_0_1.one (pk,sk,form,owner) values ('username#query2@user.com', 'const#USER', '{"username":"query2@user.com","sk":"const#USER"}'::JSONB, 'query2Owner' );
	    
	insert into base_0_0_1.one (pk, sk, tk, form, owner) values ('one', 'const#ADOPTEE', '1', '{"name":"One", "drain_id":"One","lat":1.0, "lon":1.0}'::JSONB, 'duckduckgoose'); 
	
	insert into base_0_0_1.one (pk, sk, tk, form, owner) values ('two', 'const#ADOPTEE', '2', '{"name":"Two", "drain_id":"Two","lat":2.0, "lon":2.0}'::JSONB, 'duckduckgoose'); 
	
	insert into base_0_0_1.one (pk, sk, tk, form, owner) values ('three', 'const#ADOPTEE', '3', '{"name":"Three", "drain_id":"Three","lat":3.0, "lon":3.0}'::JSONB, 'goose'); 
  
  
  2Raise Notice 'A %', base_0_0_1.rquery(format('{"pk":"one","sk":"*","owner":"duckduckgoose","mbr":%s}',mbr)::JSONB); 
  3Raise Notice 'B %', base_0_0_1.rquery(format('{"pk":"two","sk":"const#ADOPTEE","owner":"duckduckgoose","mbr":%s}',mbr)::JSONB); 
  4Raise Notice 'C %', base_0_0_1.rquery(format('{"pk":"three","sk":"*","mbr":%s}',mbr)::JSONB); 
  5Raise Notice 'D %', base_0_0_1.rquery(format('{"pk":"one","sk":"const#ADOPTEE","mbr":%s}',mbr)::JSONB); 
  6Raise Notice 'E %', base_0_0_1.rquery('{"pk":"two","sk":"*","owner":"duckduckgoose"}'::JSONB); 
  7Raise Notice 'F %', base_0_0_1.rquery('{"pk":"three","sk":"const#ADOPTEE","owner":"goose"}'::JSONB); 
  8Raise Notice 'G %', base_0_0_1.rquery('{"pk":"one","sk":"*"}'::JSONB); 
  9Raise Notice 'H %', base_0_0_1.rquery('{"pk":"two","sk":"const#ADOPTEE"}'::JSONB); 
  10 Raise Notice 'I %', base_0_0_1.rquery(format('{"sk":"const#ADOPTEE","tk":"*","mbr": %s, "owner":"duckduckgoose"}',mbr)::JSONB); 
  11 Raise Notice 'J %', base_0_0_1.rquery(format('{"sk":"const#ADOPTEE","tk":"3","owner":"goose", "mbr": %s}',mbr)::JSONB); 
  12 Raise Notice 'K %', base_0_0_1.rquery(format('{"sk":"const#ADOPTEE","tk":"*","mbr": %s}',mbr)::JSONB); 
  
  13 Raise Notice 'L %', base_0_0_1.rquery(format('{"sk":"const#ADOPTEE","tk":"1", "mbr": %s}',mbr)::JSONB	); 
  14 Raise Notice 'M %', base_0_0_1.rquery('{"sk":"const#ADOPTEE","tk":"*", "owner":"duckduckgoose"}'::JSONB); 
  15 Raise Notice 'N %', base_0_0_1.rquery('{"sk":"const#ADOPTEE","tk":"2", "owner":"duckduckgoose"}'::JSONB); 
  16 Raise Notice 'O %', base_0_0_1.rquery('{"sk":"const#ADOPTEE","tk":"*"}'::JSONB);  
  17 Raise Notice 'P %', base_0_0_1.rquery('{"sk":"const#ADOPTEE","tk":"3"}'::JSONB); 
  18 Raise Notice 'Q %', base_0_0_1.rquery(format('{"xk":"3","yk":"*", "owner":"goose", "mbr": %s}',mbr)::JSONB); 
  19 Raise Notice 'R %', base_0_0_1.rquery(format('{"xk":"1","yk":"const#ADOPTEE", "owner":"duckduckgoose", "mbr": %s}',mbr)::JSONB); 
  20 Raise Notice 'S %', base_0_0_1.rquery(format('{"xk":"2","yk":"*", "mbr": %s}',mbr)::JSONB); 
  21 Raise Notice 'T %', base_0_0_1.rquery(format('{"xk":"3","yk":"const#ADOPTEE", "mbr": %s}',mbr)::JSONB); 
  
  22 Raise Notice 'U %', base_0_0_1.rquery('{"xk":"1","yk":"*", "owner": "duckduckgoose"}'::JSONB); 
  23 Raise Notice 'V %', base_0_0_1.rquery('{"xk":"2","yk":"const#ADOPTEE", "owner": "duckduckgoose"}'::JSONB); 
  24 Raise Notice 'W %', base_0_0_1.rquery('{"xk":"3","yk":"*"}'::JSONB); 
  25 Raise Notice 'X %', base_0_0_1.rquery('{"xk":"1","yk":"const#ADOPTEE"}'::JSONB); 
  

ROLLBACK;     
  
END;
$BODY$;
*/
const Step = require('../../lib/runner/step');
module.exports = class FunctionQueryTest extends Step {
  constructor(kind, baseVersion) {
    // $lab:coverage:off$
    super(kind, baseVersion);
    this.name = 'query';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    // this.chelate =  '{"sk": "const#ADOPTEE", "tk": "*", "mbr":{"west": 0.0, "east": 2.0, "north": 2.0, "south": 0.0}}';
    this.mbr = '{"west":0.0, "east": 4.0, "north": 4.0, "south": 0.0}';
    this.sql = `BEGIN;
      insert into base_0_0_1.one (pk, sk, tk, form, owner) values ('one', 'const#ADOPTEE', '1', '{"name":"One", "drain_id":"One","lat":1.0, "lon":1.0}'::JSONB, 'duckduckgoose'); 
	
	    insert into base_0_0_1.one (pk, sk, tk, form, owner) values ('two', 'const#ADOPTEE', '2', '{"name":"Two", "drain_id":"Two","lat":2.0, "lon":2.0}'::JSONB, 'duckduckgoose'); 
	
	    insert into base_0_0_1.one (pk, sk, tk, form, owner) values ('three', 'const#ADOPTEE', '3', '{"name":"Three", "drain_id":"Three","lat":3.0, "lon":3.0}'::JSONB, 'goose'); 
  
    
      SELECT plan(25);
    
      -- 1
    
      SELECT has_function(
    
          '${this.kind}_${this.version}',
    
          'query',
    
          ARRAY[ 'JSONB'],
    
          'DB Function query (jsonb) should exist'
    
      );

      -- 2 pk
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":"one","sk":"*","owner":"duckduckgoose","mbr": ${this.mbr}}'::JSONB) - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query pk sk=* 200 0_0_1'::TEXT
    
      );
      -- 3 pk
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":"two","sk":"const#ADOPTEE","owner":"duckduckgoose","mbr":${this.mbr}}'::JSONB) - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query pk sk owner mbr 200 0_0_1'::TEXT
    
      );

      -- 4
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":"three","sk":"*","mbr":${this.mbr}}'::JSONB) - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query pk sk=* mbr 200 0_0_1'::TEXT
    
      );
      -- 5
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":"one","sk":"const#ADOPTEE","mbr":${this.mbr}}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query pk sk mbr 200 0_0_1'::TEXT
    
      );
      -- 6
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":"two","sk":"*","owner":"duckduckgoose"}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query pk sk=* owner 200 0_0_1'::TEXT
    
      );
      -- 7
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":"three","sk":"const#ADOPTEE","owner":"goose"}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query pk sk owner 200 0_0_1'::TEXT
    
      );
      -- 8
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":"one","sk":"*"}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query pk sk=* 200 0_0_1'::TEXT
    
      );
      -- 9
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":"two","sk":"const#ADOPTEE"}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query pk sk 200 0_0_1'::TEXT
    
      );
      -- 10
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":"const#ADOPTEE","tk":"*","mbr": ${this.mbr}, "owner":"duckduckgoose"}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query sk tk=* mbr owner 200 0_0_1'::TEXT
    
      );
      -- 11
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":"const#ADOPTEE","tk":"3","owner":"goose", "mbr": ${this.mbr}}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query sk tk mbr owner 200 0_0_1'::TEXT
    
      );
      -- 12
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":"const#ADOPTEE","tk":"*","mbr": ${this.mbr}}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query sk tk=* mbr 200 0_0_1'::TEXT
    
      );
      -- 13
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":"const#ADOPTEE","tk":"1", "mbr": ${this.mbr}}'::JSONB	)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query sk tk mbr 200 0_0_1'::TEXT
    
      );
      -- 14
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":"const#ADOPTEE","tk":"*", "owner":"duckduckgoose"}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query sk tk=* owner 200 0_0_1'::TEXT
    
      );
      -- 15
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":"const#ADOPTEE","tk":"2", "owner":"duckduckgoose"}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query sk tk owner 200 0_0_1'::TEXT
    
      );
      -- 16
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":"const#ADOPTEE","tk":"*"}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query sk tk=*  200 0_0_1'::TEXT
    
      );
      -- 17
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":"const#ADOPTEE","tk":"3"}'::JSONB )  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query sk tk  200 0_0_1'::TEXT
    
      );
      -- 18
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"xk":"3","yk":"*", "owner":"goose", "mbr": ${this.mbr}}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query xk yk=* owner mbr 200 0_0_1'::TEXT
    
      );
      -- 19
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"xk":"1","yk":"const#ADOPTEE", "owner":"duckduckgoose", "mbr": ${this.mbr}}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query xk yk owner mbr 200 0_0_1'::TEXT
    
      );
      -- 20
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"xk":"2","yk":"*", "mbr": ${this.mbr}}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query xk yk=* mbr 200 0_0_1'::TEXT
    
      );
      -- 21
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"xk":"3","yk":"const#ADOPTEE", "mbr": ${this.mbr}}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query xk yk mbr 200 0_0_1'::TEXT
    
      );
      -- 22
      SELECT is (
    
        ${this.kind}_${this.version}.query( '{"xk":"1","yk":"*", "owner": "duckduckgoose"}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query xk yk=* owner 200 0_0_1'::TEXT
    
      );
      -- 23
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"xk":"2","yk":"const#ADOPTEE", "owner": "duckduckgoose"}'::JSONB)  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query xk yk owner 200 0_0_1'::TEXT
    
      );
      -- 24
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"xk":"3","yk":"*"}'::JSONB )  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query xk yk=* 200 0_0_1'::TEXT
    
      );
      -- 25
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"xk":"1","yk":"const#ADOPTEE"}'::JSONB )  - 'selection',
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query xk yk 200 0_0_1'::TEXT
    
      );


      SELECT * FROM finish();

    ROLLBACK;
    `;
    // console.log(this.sql);
    // $lab:coverage:on$
  }    
};