'use strict';

// const pg = require('pg');

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionPagePutTopj extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.method = 'PUT';
    
    this.name = 'page';
    this.desc = `${this.method} ${this.name} by identity with form`;

    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_admin';
    this.scope = 'api_admin';
    this.pk = 'page_id';
    this.sk = 'name';
    this.tk = 'value';
    this.baseKind='base';
    this.baseVersion=baseVersion;
    
    this.params = 'token TOKEN, _owner OWNER_ID, id PRIMARYKEY, form JSONB';
    
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
    Declare result JSONB; 
    Declare tmp TEXT;
    Declare chelate JSONB := '{"pk":"${this.pk}", 
                                   "sk":"${this.sk}", 
                                   "tk":"${this.tk}", 
                                   "form":"", 
                                   "owner":"*", 
                                   "created":"*", 
                                   "updated":"*", 
                                   "active": true}'::JSONB;
    BEGIN
          
      -- [Function: page given user_token TOKEN, _owner OWNER_ID, id PRIMARYKEY, form JSONB]
      -- [Description: Update an existing user / page]
      -- not supported under Hobby
      
      -- [Validate id parameter]
      if id is NULL then
            -- [Fail 400 when id is NULL]
            return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      -- [Validate Token]
      result := base_${this.baseVersion}.validate_token(token, '${this.role}') ;

      if result is NULL then
            -- [Fail 403 When token is invalid]
            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
      end if;
    
      -- [Validate form parameter]
      if form is NULL then
              -- [Fail 400 when form is NULL]
              -- not available in hobby RESET ROLE;
              return '{"status":"400","msg":"Bad Request", "extra":"page A"}'::JSONB;
      end if;

      -- [Validate Form with user's credentials]

      form := form::JSONB;
      
      -- [* Validate Requred PUT form fields]
      if not(form ? (chelate->>'pk')::TEXT) then
        -- [* Fail 400 when form is missing page_id field]
        return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;
  
      if not(form ? (chelate->>'sk')::TEXT) then
          -- [* Fail 400 when form is missing name field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;
    
      if not(form ? (chelate->>'tk')::TEXT) then
          -- [* Fail 400 when form is missing value field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;
    
      
      -- [Assemble Data]
      chelate := chelate || format('{"form": %s}', form)::JSONB;
      chelate := chelate || format('{"pk": "%s#%s", 
		                             "sk": "%s#%s", 
		                             "tk": "%s#%s"}',      
		                             chelate->>'pk',
		                             form->>format('%s',chelate->>'pk'),     
		                             chelate->>'sk',
		                             form->>format('%s',chelate->>'sk'), 
		                             chelate->>'tk',
		                             form->>format('%s',chelate->>'tk'))::JSONB;

      -- [Execute update]

      result := base_${this.baseVersion}.update(chelate, _owner, id); 

      -- [Return {status,msg,updation}]

      return result;

    END;

    $$ LANGUAGE plpgsql;

    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN,OWNER_ID, IDENTITY, JSONB ) to ${this.role};
    */

    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `.${this.name}(${this.params}) .${this.method} .${this.role} .${this.desc}.`;
  }
};