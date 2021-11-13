'use strict';
// const pg = require('pg');

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionAdopterPut extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'adopter';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user,api_admin';
    this.scope = 'api_user';
    this.pk = 'username';
    this.sk = 'const#USER';
    this.method = 'PUT';
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, id IDENTITY, form JSONB, owner OWNER_ID';
    
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
    Declare result JSONB; 
    Declare chelate JSONB := '{}'::JSONB;
    Declare key_map JSONB := '{"pk":"${this.pk}","sk":"${this.sk}"}'::JSONB;
    Declare tmp TEXT;
    BEGIN
          
      -- [Function: adopter given user_token TOKEN, form JSONB, owner_key OWNER_ID]
      -- [Description: Update an existing user/ adopter]
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
      
      -- [Verify token has expected scope]

      -- [Validate form parameter]
      if form is NULL then
              -- [Fail 400 when form is NULL]
              -- not available in hobby RESET ROLE;

              return '{"status":"400","msg":"Bad Request", "extra":"adopter A"}'::JSONB;
      end if;

      -- [Validate Form with user's credentials]

      -- [Hash password when found]
      
      if form ? 'password' then
              form := form || format('{"password": "%s"}',crypt(form ->> 'password', gen_salt('bf')) )::JSONB;
      end if;

      -- [Assign Scope]

      form := form || format('{"scope":"%s"}','${this.scope}')::JSONB;

      -- [Assemble Data]
      chelate := chelate || format('{"form": %s}', form)::JSONB;
      chelate := chelate || key_map || format('{"pk": "${this.pk}#%s"}',id.id)::JSONB;    

      -- [Execute update]

      result := base_${this.baseVersion}.update(chelate, owner); 

      -- [Return {status,msg,updation}]

      return result;

    END;

    $$ LANGUAGE plpgsql;

    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN,JSONB,OWNER_ID) to ${this.role};
    */

    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.method}`;
  }
};