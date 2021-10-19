/*
'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class FunctionQuery002 extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.version = `${baseName}_${baseVersion}`;
    
    this.name = 'query';
    this.name = `${this.version}.${this.name}`;
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
      --            or {pk:"", sk:"", mbr:{west:0.0,east:0.0,north:0.0,south:0.0}} 
      --            or {sk:"", tk:"", mbr:{west:0.0,east:0.0,north:0.0,south:0.0}} 
      --            or {xk:"", yk:"", mbr:{west:0.0,east:0.0,north:0.0,south:0.0}}
      -- [Validate parameters (chelate)]
    
      if chelate is NULL then
    
        -- [Fail 400 when a parameter is NULL]
        return format('{"status":"400","msg":"Bad Request", "extra":"A", "chelate": %s}',chelate)::JSONB;
    
      end if;
    
      _chelate := chelate::JSONB;
      
      BEGIN
        
        -- [Note sk, tk, yk key may contain wildcards *]    
        -- [Remove password when found]
    
        if _chelate ? 'pk' and _chelate ? 'sk' and _chelate ->> 'sk' = '*' then
    
          if not(_chelate ? 'mbr') then
              -- [Query where _chelate is {pk, sk:*}]      
		      SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result    
		            FROM ${this.version}.one u    
		            where pk = lower(_chelate ->> 'pk');
          else
              -- [Query where _chelate is {pk, sk:*, mbr}]          
              SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result    
		            FROM ${this.version}.one u    
		            where pk = lower(_chelate ->> 'pk')
		              and form->>'lon' <= (_chelate->>'mbr')::JSONB->>'east'
	                  and form->>'lon' >= (_chelate->>'mbr')::JSONB->>'west'
	                  and form->>'lat' <= (_chelate->>'mbr')::JSONB->>'north'
	                  and form->>'lat' >= (_chelate->>'mbr')::JSONB->>'south'
		            ;
          end if;		            

        elsif _chelate ? 'pk' and _chelate ? 'sk' then
    
          if not(_chelate ? 'mbr') then
              -- [Query where _chelate is {pk, sk} or {pk, sk, mbr}]      
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u    
	            where pk = lower(_chelate ->> 'pk')  and sk = _chelate ->> 'sk';
	      else 
              -- [Query where _chelate is {pk, sk, mbr}]      
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u    
	            where pk = lower(_chelate ->> 'pk')  and sk = _chelate ->> 'sk'
	                  and form->>'lon' <= (_chelate->>'mbr')::JSONB->>'east'
	                  and form->>'lon' >= (_chelate->>'mbr')::JSONB->>'west'
	                  and form->>'lat' <= (_chelate->>'mbr')::JSONB->>'north'
	                  and form->>'lat' >= (_chelate->>'mbr')::JSONB->>'south'
	            ;
	      end if;    
          
        elsif _chelate ? 'sk' and _chelate ? 'tk' and _chelate ->> 'tk' = '*' then
    
          if not(_chelate ? 'mbr') then
              -- [Query where _chelate is {sk, tk:*}]          
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u
	            where sk = _chelate ->> 'sk';
	      else 
	          -- [Query where _chelate is {sk, tk*, mbr}]    
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u
	            where sk = _chelate ->> 'sk'
	            	and form->>'lon' <= (_chelate->>'mbr')::JSONB->>'east'
	                and form->>'lon' >= (_chelate->>'mbr')::JSONB->>'west'
	                and form->>'lat' <= (_chelate->>'mbr')::JSONB->>'north'
	                and form->>'lat' >= (_chelate->>'mbr')::JSONB->>'south'
	            ;
	            
	      end if;      
            
    
        elsif _chelate ? 'sk' and _chelate ? 'tk' then
    
    	  if not(_chelate ? 'mbr') then
              -- [Query where _chelate is {sk, tk}]
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u
	            where sk = _chelate ->> 'sk' and tk = _chelate ->> 'tk';
          else
               -- [Query where _chelate is {sk, tk, mbr}]
	           SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
		            FROM ${this.version}.one u
		            where sk = _chelate ->> 'sk' and tk = _chelate ->> 'tk'
			            and form->>'lon' <= (_chelate->>'mbr')::JSONB->>'east'
		                and form->>'lon' >= (_chelate->>'mbr')::JSONB->>'west'
		                and form->>'lat' <= (_chelate->>'mbr')::JSONB->>'north'
		                and form->>'lat' >= (_chelate->>'mbr')::JSONB->>'south'
		            ;
          end if; 
          
        elsif _chelate ? 'xk' and _chelate ? 'yk' and _chelate ->> 'yk' = '*'  then
    
          if not(_chelate ? 'mbr') then  
              -- [Query where _chelate is {xk,yk:*}] 	     
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u
	            where tk = _chelate ->> 'xk';
          else
               -- [Query where _chelate is {xk,yk:*, mbr}]     
	           SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
		            FROM ${this.version}.one u
		            where tk = _chelate ->> 'xk'
		            	and form->>'lon' <= (_chelate->>'mbr')::JSONB->>'east'
		                and form->>'lon' >= (_chelate->>'mbr')::JSONB->>'west'
		                and form->>'lat' <= (_chelate->>'mbr')::JSONB->>'north'
		                and form->>'lat' >= (_chelate->>'mbr')::JSONB->>'south'
		            ;
          end if;
                 
        elsif _chelate ? 'xk' and _chelate ? 'yk' then
    
          if not(_chelate ? 'mbr') then
          	  -- [Query where _chelate is {xk, yk}]
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u
	            where tk = _chelate ->> 'xk' and sk = _chelate ->> 'yk';
          else
              -- [Query where _chelate is {xk, yk, mbr}]
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
		            FROM ${this.version}.one u
		            where tk = _chelate ->> 'xk' and sk = _chelate ->> 'yk'
		            	and form->>'lon' <= (_chelate->>'mbr')::JSONB->>'east'
		                and form->>'lon' >= (_chelate->>'mbr')::JSONB->>'west'
		                and form->>'lat' <= (_chelate->>'mbr')::JSONB->>'north'
		                and form->>'lat' >= (_chelate->>'mbr')::JSONB->>'south'
		            ;
          end if;
          	          
          
        else
    
          -- [Fail 400 when the Search Pattern is missing expected Keys]
          return format('{"status:"400","msg":"Bad Request", "extra":"B%s", "chelate": %s}', sqlstate, _chelate)::JSONB;
    
        end if;
    
      EXCEPTION
    
          when others then
    
            --Raise Notice 'query EXCEPTION out';
            return format('{"status":"400","msg":"Bad Request", "extra":"C%s","chelate": %s}',sqlstate, _chelate)::JSONB;
    
      END;
    
      if _result is NULL then
    
        -- [Fail 404 when query results are empty 
        return format('{"status":"404","msg":"Not Found","chelate": %s}', _chelate::TEXT)::JSONB;
    
      end if;
   
      -- [Return {status,msg,selection}]
      return format('{"status":"200", "msg":"OK", "selection": %s}', _result)::JSONB;
    
    END;
    
    $$ LANGUAGE plpgsql;
    
    -- Doesnt work in Hobby
    --grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_guest;
    
    --grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_user;
    
    --grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_ admin;
    
    `;
    // console.log('CreateFunction', this.sql);
  }    
};
*/