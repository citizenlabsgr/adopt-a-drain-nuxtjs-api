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
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(criteria JSONB) RETURNS JSONB
    AS $$
    
      declare _result JSONB;
      DECLARE _criteria JSONB;
    BEGIN
    
      -- [Function: Query by Criteria like {pk,sk},{sk,tk}, or {xk,yk}]
      -- [Description: General search]
      -- select by pk and sk
      -- or sk and tk
      -- use wildcard * in any position    
      -- criteria is {pk:"", sk:""} 
      --            or {sk:"", tk:""} 
      --            or {xk:"", yk:""}
      --            or {pk:"", sk:"", mbr:{west:0.0,east:0.0,north:0.0,south:0.0}} 
      --            or {sk:"", tk:"", mbr:{west:0.0,east:0.0,north:0.0,south:0.0}} 
      --            or {xk:"", yk:"", mbr:{west:0.0,east:0.0,north:0.0,south:0.0}}
      -- [Validate parameters (criteria)]
    
      if criteria is NULL then
    
        -- [Fail 400 when a parameter is NULL]
        return format('{"status":"400","msg":"Bad Request", "extra":"A", "criteria": %s}',criteria)::JSONB;
    
      end if;
    
      _criteria := criteria::JSONB;
      
      BEGIN
        
        -- [Note sk, tk, yk key may contain wildcards *]    
        -- [Remove password when found]
    
        if _criteria ? 'pk' and _criteria ? 'sk' and _criteria ->> 'sk' = '*' then
    
          if not(_criteria ? 'mbr') then
              -- [Query where _criteria is {pk, sk:*}]      
		      SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result    
		            FROM ${this.version}.one u    
		            where pk = lower(_criteria ->> 'pk');
          else
              -- [Query where _criteria is {pk, sk:*, mbr}]          
              SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result    
		            FROM ${this.version}.one u    
		            where pk = lower(_criteria ->> 'pk')
		              and form->>'lon' <= (_criteria->>'mbr')::JSONB->>'east'
	                  and form->>'lon' >= (_criteria->>'mbr')::JSONB->>'west'
	                  and form->>'lat' <= (_criteria->>'mbr')::JSONB->>'north'
	                  and form->>'lat' >= (_criteria->>'mbr')::JSONB->>'south'
		            ;
          end if;		            

        elsif _criteria ? 'pk' and _criteria ? 'sk' then
    
          if not(_criteria ? 'mbr') then
              -- [Query where _criteria is {pk, sk} or {pk, sk, mbr}]      
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u    
	            where pk = lower(_criteria ->> 'pk')  and sk = _criteria ->> 'sk';
	      else 
              -- [Query where _criteria is {pk, sk, mbr}]      
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u    
	            where pk = lower(_criteria ->> 'pk')  and sk = _criteria ->> 'sk'
	                  and form->>'lon' <= (_criteria->>'mbr')::JSONB->>'east'
	                  and form->>'lon' >= (_criteria->>'mbr')::JSONB->>'west'
	                  and form->>'lat' <= (_criteria->>'mbr')::JSONB->>'north'
	                  and form->>'lat' >= (_criteria->>'mbr')::JSONB->>'south'
	            ;
	      end if;    
          
        elsif _criteria ? 'sk' and _criteria ? 'tk' and _criteria ->> 'tk' = '*' then
    
          if not(_criteria ? 'mbr') then
              -- [Query where _criteria is {sk, tk:*}]          
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u
	            where sk = _criteria ->> 'sk';
	      else 
	          -- [Query where _criteria is {sk, tk*, mbr}]    
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u
	            where sk = _criteria ->> 'sk'
	            	and form->>'lon' <= (_criteria->>'mbr')::JSONB->>'east'
	                and form->>'lon' >= (_criteria->>'mbr')::JSONB->>'west'
	                and form->>'lat' <= (_criteria->>'mbr')::JSONB->>'north'
	                and form->>'lat' >= (_criteria->>'mbr')::JSONB->>'south'
	            ;
	            
	      end if;      
            
    
        elsif _criteria ? 'sk' and _criteria ? 'tk' then
    
    	  if not(_criteria ? 'mbr') then
              -- [Query where _criteria is {sk, tk}]
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u
	            where sk = _criteria ->> 'sk' and tk = _criteria ->> 'tk';
          else
               -- [Query where _criteria is {sk, tk, mbr}]
	           SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
		            FROM ${this.version}.one u
		            where sk = _criteria ->> 'sk' and tk = _criteria ->> 'tk'
			            and form->>'lon' <= (_criteria->>'mbr')::JSONB->>'east'
		                and form->>'lon' >= (_criteria->>'mbr')::JSONB->>'west'
		                and form->>'lat' <= (_criteria->>'mbr')::JSONB->>'north'
		                and form->>'lat' >= (_criteria->>'mbr')::JSONB->>'south'
		            ;
          end if; 
          
        elsif _criteria ? 'xk' and _criteria ? 'yk' and _criteria ->> 'yk' = '*'  then
    
          if not(_criteria ? 'mbr') then  
              -- [Query where _criteria is {xk,yk:*}] 	     
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u
	            where tk = _criteria ->> 'xk';
          else
               -- [Query where _criteria is {xk,yk:*, mbr}]     
	           SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
		            FROM ${this.version}.one u
		            where tk = _criteria ->> 'xk'
		            	and form->>'lon' <= (_criteria->>'mbr')::JSONB->>'east'
		                and form->>'lon' >= (_criteria->>'mbr')::JSONB->>'west'
		                and form->>'lat' <= (_criteria->>'mbr')::JSONB->>'north'
		                and form->>'lat' >= (_criteria->>'mbr')::JSONB->>'south'
		            ;
          end if;
                 
        elsif _criteria ? 'xk' and _criteria ? 'yk' then
    
          if not(_criteria ? 'mbr') then
          	  -- [Query where _criteria is {xk, yk}]
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	            FROM ${this.version}.one u
	            where tk = _criteria ->> 'xk' and sk = _criteria ->> 'yk';
          else
              -- [Query where _criteria is {xk, yk, mbr}]
	          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
		            FROM ${this.version}.one u
		            where tk = _criteria ->> 'xk' and sk = _criteria ->> 'yk'
		            	and form->>'lon' <= (_criteria->>'mbr')::JSONB->>'east'
		                and form->>'lon' >= (_criteria->>'mbr')::JSONB->>'west'
		                and form->>'lat' <= (_criteria->>'mbr')::JSONB->>'north'
		                and form->>'lat' >= (_criteria->>'mbr')::JSONB->>'south'
		            ;
          end if;
          	          
          
        else
    
          -- [Fail 400 when the Search Pattern is missing expected Keys]
          return format('{"status:"400","msg":"Bad Request", "extra":"B%s", "criteria": %s}', sqlstate, _criteria)::JSONB;
    
        end if;
    
      EXCEPTION
    
          when others then
    
            --Raise Notice 'query EXCEPTION out';
            return format('{"status":"400","msg":"Bad Request", "extra":"C%s","criteria": %s}',sqlstate, _criteria)::JSONB;
    
      END;
    
      if _result is NULL then
    
        -- [Fail 404 when query results are empty 
        return format('{"status":"404","msg":"Not Found","criteria": %s}', _criteria::TEXT)::JSONB;
    
      end if;
   
      -- [Return {status,msg,selection}]
      return format('{"status":"200", "msg":"OK", "selection": %s}', _result)::JSONB;
    
    END;
    
    $$ LANGUAGE plpgsql;
    
    /* Doesnt work in Hobby
    --grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_guest;
    
    grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_user;
    
    grant EXECUTE on FUNCTION ${this.name}(JSONB) to api_admin;
    */
    `;
    // console.log('CreateFunction', this.sql);
  }    
};