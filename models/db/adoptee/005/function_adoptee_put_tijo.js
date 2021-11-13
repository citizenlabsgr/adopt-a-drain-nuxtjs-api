'use strict';

// const pg = require('pg');

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionAdopteePut extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.method = 'PUT';
    
    this.name = 'adoptee';
    this.desc = `${this.method} ${this.name} by identity with form`;

    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user,api_admin';
    this.scope = 'api_user';
    this.pk = 'drain_id';
    this.sk = 'const#ADOPTEE';
    this.baseKind='base';
    this.baseVersion=baseVersion;
    
    this.params = 'token TOKEN, id IDENTITY, form JSONB, _owner OWNER_ID';
    
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
    Declare result JSONB; 
    Declare chelate JSONB := '{}'::JSONB;
    Declare key_map JSONB := '{"pk":"${this.pk}","sk":"${this.sk}"}'::JSONB;
    Declare tmp TEXT;
    BEGIN
          
      -- [Function: adoptee given user_token TOKEN, id IDENTITY, form JSONB, _owner OWNER_ID]
      -- [Description: Update an existing user / adoptee]
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

              return '{"status":"400","msg":"Bad Request", "extra":"adoptee A"}'::JSONB;
      end if;

      -- [Validate Form with user's credentials]

      form := form::JSONB;

      /*
      -- [* Validate Requred POST form fields]

      if not(form ? 'lon') then
          -- [* Fail 400 when form is missing lon field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      if not(form ? 'lat') then
          -- [* Fail 400 when form is missing lat field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;
      if not(form ? 'name') then
          -- [* Fail 400 when form is missing name field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;
      if not(form ? 'type') then
          -- [* Fail 400 when form is missing type field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;      
      if not(form ? 'drain_id') then
          -- [* Fail 400 when form is missing drain_id field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;       

      if not(form ? 'adopter_key') then
          -- [* Fail 400 when form is missing adopter_key field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if; 
      */
      -- [Assemble Data]
      chelate := chelate || format('{"form": %s}', form)::JSONB;
      chelate := chelate || key_map || format('{"pk": "${this.pk}#%s"}',id.id)::JSONB;    

      -- [Execute update]

      result := base_${this.baseVersion}.update(chelate, _owner); 

      -- [Return {status,msg,updation}]

      return result;

    END;

    $$ LANGUAGE plpgsql;

    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN, IDENTITY, JSONB, OWNER_ID) to ${this.role};
    */

    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `.${this.name}(${this.params}) .${this.method} .${this.role} .${this.desc}.`;
  }
};