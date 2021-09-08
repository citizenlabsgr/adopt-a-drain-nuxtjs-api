/*
'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class FunctionQuery001 extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    // let version = `${baseName}_${baseVersion}`;

    this.name = 'query';
    let version = `${baseName}_${baseVersion}`;
    this.name = `${version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(chelate JSONB) RETURNS JSONB
    AS $$
    
      declare _result JSONB;
      DECLARE _chelate JSONB;
    BEGIN
    
      -- [Function: Query by chelate like {pk,sk},{sk,tk}, or {xk,yk}]
      -- [Description: General search]
      -- select by pk and sk
      -- or sk and tk
      -- use wildcard * in any position    
      -- chelate is {pk:"", sk:""} 
      --            or {sk:"", tk:""} 
      --            or {xk:"", yk:""}
      --    
      -- [Validate parameters (chelate)]
    
      if chelate is NULL then
    
        -- [Fail 400 when a parameter is NULL]
        return format('{"status":"400","msg":"Bad Request", "extra":"A", "chelate":"%s"}',chelate)::JSONB;
    
      end if;
    
      _chelate := chelate::JSONB;
      
      BEGIN
        
        -- [Note sk, tk, yk key may contain wildcards *]    
        -- [Remove password when found]
    
        if _chelate ? 'pk' and _chelate ? 'sk' and _chelate ->> 'sk' = '*' then
    
              -- [Query where _chelate is {pk, sk:*}]      
		      SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result    
		            FROM ${version}.one u    
		            where pk = lower(_chelate ->> 'pk');		            

        elsif _chelate ? 'pk' and _chelate ? 'sk' then
    
              -- [Query where _chelate is {pk, sk}]      
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${version}.one u    
	            where pk = lower(_chelate ->> 'pk')  and sk = _chelate ->> 'sk';  
          
        elsif _chelate ? 'sk' and _chelate ? 'tk' and _chelate ->> 'tk' = '*' then
    
              -- [Query where _chelate is {sk, tk:*}]          
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${version}.one u
	            where sk = _chelate ->> 'sk';   
    
        elsif _chelate ? 'sk' and _chelate ? 'tk' then
    
              -- [Query where _chelate is {sk, tk}]
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${version}.one u
	            where sk = _chelate ->> 'sk' and tk = _chelate ->> 'tk';
          
        elsif _chelate ? 'xk' and _chelate ? 'yk' and _chelate ->> 'yk' = '*'  then
    
              -- [Query where _chelate is {xk,yk:*}] 	     
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${version}.one u
	            where tk = _chelate ->> 'xk';
                 
        elsif _chelate ? 'xk' and _chelate ? 'yk' then
    
          	  -- [Query where _chelate is {xk, yk}]
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${version}.one u
	            where tk = _chelate ->> 'xk' and sk = _chelate ->> 'yk';

        else
    
          -- [Fail 400 when the Search Pattern is missing expected Keys]
          return format('{"status:"400","msg":"Bad Request", "extra":"B%s", "chelate": "%s"}', sqlstate, _chelate::TEXT)::JSONB;
    
        end if;
    
      EXCEPTION
    
          when others then
    
            --Raise Notice 'query EXCEPTION out';
            return format('{"status":"400","msg":"Bad Request", "extra":"C%s","chelate": "%s"}',sqlstate, _chelate::TEXT)::JSONB;
    
      END;
    
      if _result is NULL then
    
        -- [Fail 404 when query results are empty 
        return format('{"status":"404","msg":"Not Found","chelate": %s}', _chelate::TEXT)::JSONB;
    
      end if;
   
      -- [Return {status,msg,selection}]
      return format('{"status":"200", "msg":"OK", "selection":%s}', _result)::JSONB;
    
    END;
    
    $$ LANGUAGE plpgsql;
    
    // Doesnt work in Hobby
    --grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_guest;
    
    --grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_user;
    
    --grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_admin;
    
    `;
    // console.log('CreateFunction', this.sql);
  }    
};
*/