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
  
  
  Raise Notice 'A %', base_0_0_1.rquery(format('{"pk":"one","sk":"*","owner":"duckduckgoose","mbr":%s}',mbr)::JSONB); 
  Raise Notice 'B %', base_0_0_1.rquery(format('{"pk":"two","sk":"const#ADOPTEE","owner":"duckduckgoose","mbr":%s}',mbr)::JSONB); 
  Raise Notice 'C %', base_0_0_1.rquery(format('{"pk":"three","sk":"*","mbr":%s}',mbr)::JSONB); 
  Raise Notice 'D %', base_0_0_1.rquery(format('{"pk":"one","sk":"const#ADOPTEE","mbr":%s}',mbr)::JSONB); 
  Raise Notice 'E %', base_0_0_1.rquery('{"pk":"two","sk":"*","owner":"duckduckgoose"}'::JSONB); 
  Raise Notice 'F %', base_0_0_1.rquery('{"pk":"three","sk":"const#ADOPTEE","owner":"goose"}'::JSONB); 
  Raise Notice 'G %', base_0_0_1.rquery('{"pk":"one","sk":"*"}'::JSONB); 
  Raise Notice 'H %', base_0_0_1.rquery('{"pk":"two","sk":"const#ADOPTEE"}'::JSONB); 
  Raise Notice 'I %', base_0_0_1.rquery(format('{"sk":"const#ADOPTEE","tk":"*","mbr": %s, "owner":"duckduckgoose"}',mbr)::JSONB); 
  Raise Notice 'J %', base_0_0_1.rquery(format('{"sk":"const#ADOPTEE","tk":"3","owner":"goose", "mbr": %s}',mbr)::JSONB); 
  Raise Notice 'K %', base_0_0_1.rquery(format('{"sk":"const#ADOPTEE","tk":"*","mbr": %s}',mbr)::JSONB); 
  
  Raise Notice 'L %', base_0_0_1.rquery(format('{"sk":"const#ADOPTEE","tk":"1", "mbr": %s}',mbr)::JSONB	); 
  Raise Notice 'M %', base_0_0_1.rquery('{"sk":"const#ADOPTEE","tk":"*", "owner":"duckduckgoose"}'::JSONB); 
  Raise Notice 'N %', base_0_0_1.rquery('{"sk":"const#ADOPTEE","tk":"2", "owner":"duckduckgoose"}'::JSONB); 
  Raise Notice 'O %', base_0_0_1.rquery('{"sk":"const#ADOPTEE","tk":"*"}'::JSONB);  
  Raise Notice 'P %', base_0_0_1.rquery('{"sk":"const#ADOPTEE","tk":"3"}'::JSONB); 
  Raise Notice 'Q %', base_0_0_1.rquery(format('{"xk":"3","yk":"*", "owner":"goose", "mbr": %s}',mbr)::JSONB); 
  Raise Notice 'R %', base_0_0_1.rquery(format('{"xk":"1","yk":"const#ADOPTEE", "owner":"duckduckgoose", "mbr": %s}',mbr)::JSONB); 
  Raise Notice 'S %', base_0_0_1.rquery(format('{"xk":"2","yk":"*", "mbr": %s}',mbr)::JSONB); 
  Raise Notice 'T %', base_0_0_1.rquery(format('{"xk":"3","yk":"const#ADOPTEE", "mbr": %s}',mbr)::JSONB); 
  
  Raise Notice 'U %', base_0_0_1.rquery('{"xk":"1","yk":"*", "owner": "duckduckgoose"}'::JSONB); 
  Raise Notice 'V %', base_0_0_1.rquery('{"xk":"2","yk":"const#ADOPTEE", "owner": "duckduckgoose"}'::JSONB); 
  Raise Notice 'W %', base_0_0_1.rquery('{"xk":"3","yk":"*"}'::JSONB); 
  Raise Notice 'X %', base_0_0_1.rquery('{"xk":"1","yk":"const#ADOPTEE"}'::JSONB); 
  

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
    
          ARRAY[ 'JSONB', 'TEXT' ],
    
          'DB Function query (json, TEXT) should exist'
    
      );
      
      -- 2 pk
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":"*"}'::JSONB),
    
        '{"msg": "Bad Request", "extra": "C42703", "status": "400", "chelate": {"pk": "*"}}'::JSONB,
    
        'DB query pk=* 400 0_0_1'::TEXT
    
      );
    
      -- 3
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":"*"}'::JSONB),
    
        '{"msg": "Bad Request", "extra": "C42703", "status": "400", "chelate": {"sk": "*"}}'::JSONB,
    
        'DB query sk=* 400 0_0_1'::TEXT
    
      );
    
      -- 4
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"tk":"*"}'::JSONB),
    
        '{"msg": "Bad Request", "extra": "C42703", "status": "400", "chelate": {"tk": "*"}}'::JSONB,
    
        'DB query tk=* 400 0_0_1'::TEXT
    
      );
    
      -- 5
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":""}'::JSONB),
    
        '{"msg": "Bad Request", "extra": "C42703", "status": "400", "chelate": {"pk": ""}}'::JSONB,
    
        'DB query pk="" 400 0_0_1'::TEXT
    
      );
    
      -- 6
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":""}'::JSONB),
    
        '{"msg": "Bad Request", "extra": "C42703", "status": "400", "chelate": {"sk": ""}}'::JSONB,
    
        'DB query sk="" 400 0_0_1'::TEXT
    
      );
    
      -- 7
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"tk":""}'::JSONB),
    
        '{"msg": "Bad Request", "extra": "C42703", "status": "400", "chelate": {"tk": ""}}'::JSONB,
    
        'DB query tk="" 400 0_0_1'::TEXT
    
      );
    
      -- 8
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"pk":"","sk":"*"}'::JSONB),
        '{"msg": "OK", "status": "200", "selection": []}'::JSONB,    
        'DB query pk="" sk="*" 404 0_0_1'::TEXT
    
      );
    
      -- 9
    
      SELECT is (
    
        ${this.kind}_${this.version}.query('{"sk":"","tk":""}'::JSONB),
        '{"msg": "OK", "status": "200", "selection": []}'::JSONB,     
        'DB query sk="" tk="" 404 0_0_1'::TEXT
    
      );
    
      -- 10 pk sk
  
      SELECT ok (
    
        ${this.kind}_${this.version}.query('{"pk":"username#query@user.com", "sk":"const#USER"}'::JSONB) ->> 'msg' = 'OK',
    
        'DB query pk sk good 0_0_1'::TEXT
    
      );
  
      -- 11 pk sk=*
      
      SELECT ok (
    
        ${this.kind}_${this.version}.query('{
    
          "pk":"username#query@user.com",
    
          "sk":"*"}'::JSONB)::JSONB ->> 'msg' = 'OK',
    
        'DB query pk sk:* good 0_0_1'::TEXT
    
      );
    
    
    
      -- 12 sk tk
    
    
    
      SELECT is (
    
        (${this.kind}_${this.version}.query('{
    
          "sk":"const#USER",
    
          "tk": "query1Owner"}'::JSONB)::JSONB - 'selection'),
    
          '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query sk tk has selection is OK 0_0_1'::TEXT
    
      );
    
    
    
      -- 13 sk tk=*
    
    
    
      SELECT is (
    
        (${this.kind}_${this.version}.query('{
    
          "sk":"const#USER",
    
          "tk": "*"}'::JSONB)::JSONB - 'selection'),
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query sk tk:* good 0_0_1'::TEXT
    
      );
    
    
    
      -- 14 xk yk
    
    
    
      SELECT is (
    
        (${this.kind}_${this.version}.query('{
    
          "xk":"const#USER",    
          "yk": ""}'::JSONB)::JSONB ),
          '{"msg": "OK", "status": "200", "selection": []}'::JSONB, 
    
        'DB query xk yk bad 404 0_0_1'::TEXT
    
      );
    
    
    
      -- 15 xk yk=*
    
      -- where tk = chelate ->> 'xk'
    
    
    
      SELECT is (
    
        (${this.kind}_${this.version}.query('{
    
          "xk":"query1Owner",
    
          "yk": "*"}'::JSONB)::JSONB  - 'selection'),
    
        '{"msg": "OK", "status": "200"}'::JSONB,
    
        'DB query xk yk=* good 0_0_1'::TEXT
    
      );

      
      -- 16 MBR
    
      SELECT is (
        
        (${this.kind}_${this.version}.query('{"sk": "const#ADOPTEE", "tk": "*", "mbr":{"west": 0.0, "east": 2.0, "north": 2.0, "south": 0.0}}'::JSONB)::JSONB - 'selection'),
        '{"msg": "OK", "status": "200"}'::JSONB,
        'DB query pk="" sk="*" mbr 200 0_0_1'::TEXT
    
      );
     


      SELECT * FROM finish();

    ROLLBACK;
    `;
    // console.log(this.sql);
    // $lab:coverage:on$
  }    
};