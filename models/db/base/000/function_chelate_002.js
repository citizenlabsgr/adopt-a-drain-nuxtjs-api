'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class FunctionChelate extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'chelate'; 
	this.params = 'chelate JSONB, form JSONB';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params}) RETURNS JSONB
    AS $$
      
      DECLARE msg TEXT;
      DECLARE dtl TEXT;
      DECLARE hnt TEXT;
	BEGIN
	  BEGIN

		-- Form
		    	
		-- [Expect form add or replace existing form ]
		if form is NULL then
		    -- [Throw EXCEPTION when form is NULL]
            raise EXCEPTION 'Undefined form';
		else		
		    chelate := chelate || format('{"form": %s}',form)::JSONB;
		end if;
		
	  -- PK
	    
		-- [Expect pk: * or form-field-name or form-field-name#value]
		if not(chelate ? 'pk') then
			-- [Throw EXCEPTION when pk is missing]
		    raise EXCEPTION 'Chelate is missing pk: * or form-field-name or form-field-name#value';
 
		elsif chelate ->> 'pk' = '' then
		    -- [Throw EXCEPTION when pk is blank]
		    raise EXCEPTION 'Chelate pk is blank, pk: * or form-field-name or form-field-name#value';
		
		elsif chelate ->> 'pk' = '*' then
		    -- [Add guid when pk is '*']
		    chelate := chelate || format('{"pk": "guid#%s"}',uuid_generate_v4())::JSONB;
		
		elsif strpos(chelate ->> 'pk', 'const#') = 1  then
		    -- [Passthrough when pk value starts with const#]
		    chelate := chelate || format('{"pk": "const#%s"}',upper(split_part(chelate ->> 'pk','#',2)))::JSONB;

		elsif strpos(chelate ->> 'pk', 'guid#') = 1 then
		    -- [Passthrough when pk value starts with guid#]

		elsif strpos(chelate ->> 'pk', '#') > 1 then   
		    -- [Verify form field when pk value contains #]
		    if not(form ? split_part(chelate ->> 'pk', '#', 1)) then
		       raise EXCEPTION 'Unrecognized form field %', chelate ->> 'pk';
		    end if; 
        elsif not(form ? (chelate ->> 'pk')) then
            -- [Throw EXCEPTION when pk value is not an attribute in form]
            raise EXCEPTION 'Unknown field % in form', chelate ->> 'pk';
            
		elsif form ? (chelate ->> 'pk') then
		    -- [Format value when pk is a form field]
		    chelate := chelate || format('{"pk": "%s#%s"}', chelate ->> 'pk', form ->> (chelate ->> 'pk'))::JSONB;
		
		else
		    raise EXCEPTION 'Unknown error for pk = %', chelate ->> 'pk';      
		end if;
				
		-- SK
		
		-- [Expect sk constant value that must start with const#]
		if not(chelate ? 'sk') then
		    -- [Throw EXCEPTION when sk is missing]
			raise EXCEPTION 'Chelate is missing sk';
			
		elsif chelate ->> 'sk' = '' then
		    -- [Throw EXCEPTION when sk is blank]
		    raise EXCEPTION 'Chelate sk is blank';
		
		elsif chelate ->> 'sk' = '*' then
		    -- [Add guid when sk is '*']
		    chelate := chelate || format('{"sk": "guid#%s"}',uuid_generate_v4())::JSONB;
		
		elsif strpos(chelate ->> 'sk', 'const#') = 1  then
		    -- [Passthrough when sk value starts with const#]

		elsif strpos(chelate ->> 'sk', 'guid#') = 1 then
		    -- [Passthrough when sk value starts with guid#]

		elsif strpos(chelate ->> 'sk', '#') > 1 then   
		    -- [Verify form field when sk value contains #]
		    if not(form ? split_part(chelate ->> 'sk', '#', 1)) then
		       raise EXCEPTION 'Unrecognized form field %', chelate ->> 'pk';
		    end if; 
        
        elsif not(form ? (chelate ->> 'sk')) then
            -- [Throw EXCEPTION when sk value is not an attribute in form]
            raise EXCEPTION 'Unknown field % in form', chelate ->> 'sk';
            
		elsif form ? (chelate ->> 'sk') then
		    -- [Format value when pk is a form field]
		    chelate := chelate || format('{"sk": "%s#%s"}', chelate ->> 'sk', form ->> (chelate ->> 'sk'))::JSONB;
		
		else
		    raise EXCEPTION 'Unknown error for sk = %', chelate ->> 'sk';      
		end if;
		    	
		-- TK    	
		
		-- [Expect tk constant value that must start with const#]
		if not(chelate ? 'tk') then
		    -- [Throw EXCEPTION when tk is missing]
			raise EXCEPTION 'Chelate is missing tk: * or form-field-name or form-field-name:value';
			
		elsif chelate ->> 'tk' = '' then
		    -- [Throw EXCEPTION when tk is blank]
		    raise EXCEPTION 'Chelate tk is blank';
		    
		elsif chelate ->> 'tk' = '*' then
		    -- [Add guid when tk is '*']
		    chelate := chelate || format('{"tk": "guid#%s"}',uuid_generate_v4())::JSONB;
		
		elsif strpos(chelate ->> 'tk', 'const#') = 1  then
		    -- [Passthrough when tk value starts with const#]

		elsif strpos(chelate ->> 'tk', 'guid#') = 1 then
		    -- [Passthrough when tk value starts with guid#]

		elsif strpos(chelate ->> 'tk', '#') > 1 then   
		    -- [Verify form field when tk value contains #]
		    if not(form ? split_part(chelate ->> 'tk', '#', 1)) then
		       raise EXCEPTION 'Unrecognized form field %', chelate ->> 'tk';
		    end if; 
		    
        elsif not(form ? (chelate ->> 'tk')) then
            -- [Throw EXCEPTION when tk value is not an attribute in form]
            raise EXCEPTION 'Unknown field % in form', chelate ->> 'tk';
            
		elsif form ? (chelate ->> 'tk') then
		    -- [Format value when tk is a form field]
		    chelate := chelate || format('{"tk": "%s#%s"}', chelate ->> 'tk', form ->> (chelate ->> 'tk'))::JSONB;
		    
		else
		    raise EXCEPTION 'Unknown error for tk = %', chelate ->> 'tk';      
		end if;    	

		-- Owner
		
		-- [Expect owner constant value that must start with const#]
		if not(chelate ? 'owner') then
		    -- [Throw EXCEPTION when owner is missing]
			raise EXCEPTION 'Chelate is missing owner';
			
		elsif chelate ->> 'owner' = '' then
		    -- [Throw EXCEPTION when owner is blank]
		    raise EXCEPTION 'Chelate owner is blank';
		
		elsif chelate ->> 'owner' = '*' then
		    -- [Add guid when owner is '*']
		    chelate := chelate || format('{"owner": "%s"}', split_part(chelate ->> 'tk', '#', 2))::JSONB;
		    
		elsif strpos(chelate ->> 'owner', '#') > 1 then
		    -- [Remove everything before # when # exists]
		    chelate := chelate || format('{"owner": "%s"}', split_part(chelate ->> 'owner', '#', 2))::JSONB;
		     
		end if; 

		-- Active
		
		-- [Allow preset active]
		if not(chelate ? 'active') then
		    chelate := chelate || '{"active":true}'::JSONB;
		elsif chelate ->> 'active' = '*' then
		  	  chelate := chelate || '{"active": true}';
		elsif (chelate ->> 'active')::BOOLEAN then
		    -- [Verifiy active is boolean true]
		elsif not((chelate ->> 'active')::BOOLEAN) then  	  
			-- [Verify active is boolean false]
		end if;

		-- Created
		
		-- [Allow preset created date otherwise let db auto generate]
		if not(chelate ? 'created') then
		    chelate := chelate || format('{"created": "%s"}', CURRENT_TIMESTAMP)::JSONB; 

		elsif chelate ->> 'created' = '' then
		    chelate := chelate || format('{"created": "%s"}', CURRENT_TIMESTAMP)::JSONB; 
		
		elsif chelate ->> 'created' = '*' then
		    chelate := chelate || format('{"created": "%s"}', CURRENT_TIMESTAMP)::JSONB; 
		     
		end if;
	
		-- Updated
		
		-- [Allow preset updated date otherwise let db auto generate]
		
		if not(chelate ? 'updated') then
		    chelate := chelate || format('{"updated": "%s"}', CURRENT_TIMESTAMP)::JSONB; 

		elsif chelate ->> 'updated' = '' then
		    chelate := chelate || format('{"updated": "%s"}', CURRENT_TIMESTAMP)::JSONB; 
		
		elsif chelate ->> 'updated' = '*' then
		    chelate := chelate || format('{"updated": "%s"}', CURRENT_TIMESTAMP)::JSONB; 
		     
		end if;
		
	  EXCEPTION
	  		--when sqlstate 'NOPK' then
	  		--	RAISE NOTICE 'chelate is missing pk';
            when others then
              GET STACKED DIAGNOSTICS msg = MESSAGE_TEXT,
                          dtl = PG_EXCEPTION_DETAIL,
                          hnt = PG_EXCEPTION_HINT;
                RAISE NOTICE '%', msg;
                chelate := NULL;
      END; 
    
    return chelate;

    END;

   $$ LANGUAGE plpgsql;
    
    
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(JSONB,JSONB) to api_user;
    */
    
    CREATE OR REPLACE FUNCTION ${this.name}(chelate JSONB) RETURNS JSONB
    AS $$
    
     DECLARE _rec record;
     DECLARE _fld TEXT;
     DECLARE _form jsonb;
     DECLARE _value TEXT;
     DECLARE _key TEXT;
     DECLARE _out JSONB;  
    BEGIN
  
    -- creates proposed chelate to update
    -- "created" is added on insert, it will be in the record and doesnt need to be added
    -- "updated" is changed everytime
    
    --   GUID never changes
    _form := chelate ->> 'form';
    
    -- UPDATED date
    _out := format('{"updated": "%s"}', NOW());
    
    -- get outter keys of chelate
    
    FOR _rec IN SELECT * FROM jsonb_each_text(chelate)
    
    LOOP
    
      _key := _rec.key;
    
      _fld := split_part(_rec.value, '#', 1);
    
      if _key = 'form' then
    
         -- copy the whole form att
    
         _out := _out || format('{"form": %s}', _form::TEXT)::JSONB;
    
      elsif  _form ->> _fld is NULL then -- key not in form
    
         -- is a constant, a guid, created, keep the current value
        if not(_fld = 'updated') then -- skip updated field
           _out := _out || format('{"%s":"%s"}', _key, chelate ->> _key)::JSONB;
        end if;
    
      else
    
         -- this is a key
        _out := _out || format('{"%s":"%s#%s"}', _key, _fld, _form ->> _fld)::JSONB;
    
      end if;
    
    END LOOP;
    
    return _out;
        
    END;
    
    $$ LANGUAGE plpgsql;

    /* Doesnt work in Hobby
    GRANT EXECUTE on FUNCTION ${this.name}(JSONB) to api_user;
    */
    `;
    // console.log('CreateFunction', this.sql);
  }
  getName() {
    return `${this.name}(${this.params})`;
  }    
};