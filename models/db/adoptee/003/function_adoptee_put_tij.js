'use strict';

// const pg = require('pg');

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionAdopteePut extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'adoptee';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user';
    this.scope = 'api_user';
    this.pk = 'drain_id';
    this.sk = 'const#ADOPTEE';
    this.method = 'PUT';
    this.baseKind='base';
    this.baseVersion=baseVersion;
    
    this.params = 'token TOKEN, id IDENTITY, form JSON';
    
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
    Declare _form JSONB; 
    Declare result JSONB; 
    Declare chelate JSONB := '{}'::JSONB;
    Declare key_map JSONB := '{"pk":"${this.pk}","sk":"${this.sk}"}'::JSONB;
    Declare tmp TEXT;
    BEGIN
          
      -- [Function: adoptee given user_token TOKEN, id IDENTITY, form JSON]
      -- [Description: Update an existing user / adoptee]
      -- not supported under Hobby
      
      _form := form::JSONB ;          
      
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

              return '{"status":"400","msg":"Bad Request", "extra":"adoptee A"}'::JSONB;
      end if;

      -- [Validate Form with user's credentials]

      _form := form::JSONB;

      /*
      -- [* Validate Requred POST form fields]

      if not(_form ? 'lon') then
          -- [* Fail 400 when form is missing lon field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      if not(_form ? 'lat') then
          -- [* Fail 400 when form is missing lat field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;
      if not(_form ? 'name') then
          -- [* Fail 400 when form is missing name field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;
      if not(_form ? 'type') then
          -- [* Fail 400 when form is missing type field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;      
      if not(_form ? 'drain_id') then
          -- [* Fail 400 when form is missing drain_id field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;       

      if not(_form ? 'adopter_key') then
          -- [* Fail 400 when form is missing adopter_key field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if; 
      */
      -- [Assemble Data]
      chelate := chelate || format('{"form": %s}', _form)::JSONB;
      chelate := chelate || key_map || format('{"pk": "${this.pk}#%s"}',id.id)::JSONB;    

      -- [Execute update]

      result := ${this.baseKind}_${this.baseVersion}.update(chelate, format('("%s")',result ->> 'key')::OWNER_ID); 

      -- [Return {status,msg,updation}]

      return result;

    END;

    $$ LANGUAGE plpgsql;

    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN,JSON,OWNER_ID) to ${this.role};
    */

    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `.${this.name}(${this.params}) .${this.method} .${this.role} .`;
  }
};