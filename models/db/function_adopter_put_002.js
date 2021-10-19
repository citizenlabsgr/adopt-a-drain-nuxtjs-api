'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class FunctionAdopterPut extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'adopter';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user,api_admin';
    this.pk = 'username';
    this.sk = 'const#USER';
    this.method = 'PUT';
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TEXT, id TEXT, form JSON';
    
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
    Declare _form JSONB; 
    Declare result JSONB; 
    Declare chelate JSONB := '{}'::JSONB;
    Declare key_map JSONB := '{"pk":"${this.pk}","sk":"${this.sk}"}'::JSONB;
    Declare tmp TEXT;
    BEGIN
          
      -- [Function: adopter given user_token TEXT, owner_key TEXT, form JSON]
      -- [Description: Update an existing user/ adopter]
      -- not supported under Hobby
      
      _form := form::JSONB ;          
      -- chelate := chelate || key_map || format('{"pk": "username#%s"}',id)::JSONB;
      
      -- [Validate id parameter]
      if id is NULL then
            -- [Fail 400 when id is NULL]
            return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      -- [Validate Token]
      result := ${this.baseKind}_${this.baseVersion}.validate_token(token, '${this.role}') ;

      if result is NULL then
            -- [Fail 403 When token is invalid]
            -- not available in hobby RESET ROLE;

            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
      end if;
      
      -- [Verify token has expected scope]
      /*
      if strpos(result ->> 'scope', '${this.role}') = 0 then
              -- [Fail 401 when unexpected scope is detected]
              return '{"status":"401","msg":"Unauthorized"}'::JSONB;
      end if;
      */
      -- [Validate form parameter]
      if form is NULL then
              -- [Fail 400 when form is NULL]
              -- not available in hobby RESET ROLE;

              return '{"status":"400","msg":"Bad Request", "extra":"adopter A"}'::JSONB;
      end if;

      -- [Validate Form with user's credentials]

      _form := form::JSONB;

      -- [Hash password when found]
      
      if _form ? 'password' then
              _form := _form || format('{"password": "%s"}',crypt(form ->> 'password', gen_salt('bf')) )::JSONB;
      end if;

      -- [Assign Scope]

      _form := _form || format('{"scope":"%s"}','${this.role}')::JSONB;

      -- [Assemble Data]
      chelate := chelate || format('{"form": %s}', _form)::JSONB;
      chelate := chelate || key_map || format('{"pk": "username#%s"}',id)::JSONB;    

      -- [Execute update]

      -- result := ${this.baseKind}_${this.baseVersion}.update(chelate, result ->> 'key'); -- result->> key is owner key
      result := api_0_0_1.adopter(token, id, form, result ->> 'key');
      -- [Return {status,msg,updation}]

      return result;

    END;

    $$ LANGUAGE plpgsql;
    
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TEXT,JSON,TEXT) to ${this.role};
    */

    CREATE OR REPLACE FUNCTION ${this.name}(${this.params}, owner TEXT)  RETURNS JSONB AS $$
    Declare _form JSONB; 
    Declare result JSONB; 
    Declare chelate JSONB := '{}'::JSONB;
    Declare key_map JSONB := '{"pk":"${this.pk}","sk":"${this.sk}"}'::JSONB;
    Declare tmp TEXT;
    BEGIN
          
      -- [Function: adopter given user_token TEXT, owner_key TEXT, form JSON]
      -- [Description: Update an existing user/ adopter]
      -- not supported under Hobby
      
      _form := form::JSONB ;          
      -- chelate := chelate || key_map || format('{"pk": "username#%s"}',id)::JSONB;
      
      -- [Validate id parameter]
      if id is NULL then
            -- [Fail 400 when id is NULL]
            return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      -- [Validate Token]
      result := ${this.baseKind}_${this.baseVersion}.validate_token(token, '${this.role}') ;

      if result is NULL then
            -- [Fail 403 When token is invalid]
            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
      end if;
      
      -- [Verify token has expected scope]
      /*
      if strpos(result ->> 'scope', '${this.role}') = 0 then
            -- [Fail 401 when unexpected scope is detected]
            return '{"status":"401","msg":"Unauthorized"}'::JSONB;
      end if;
      */
      -- [Validate form parameter]
      if form is NULL then
              -- [Fail 400 when form is NULL]
              -- not available in hobby RESET ROLE;

              return '{"status":"400","msg":"Bad Request", "extra":"adopter A"}'::JSONB;
      end if;

      -- [Validate Form with user's credentials]

      _form := form::JSONB;

      -- [Hash password when found]
      
      if _form ? 'password' then
              _form := _form || format('{"password": "%s"}',crypt(form ->> 'password', gen_salt('bf')) )::JSONB;
      end if;

      -- [Assign Scope]

      _form := _form || format('{"scope":"%s"}','${this.role}')::JSONB;

      -- [Assemble Data]
      chelate := chelate || format('{"form": %s}', _form)::JSONB;
      chelate := chelate || key_map || format('{"pk": "username#%s"}',id)::JSONB;    

      -- [Execute update]

      result := ${this.baseKind}_${this.baseVersion}.update(chelate, owner); -- result->> key is owner key

      -- [Return {status,msg,updation}]

      return result;

    END;

    $$ LANGUAGE plpgsql;

    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.method}`;
  }
};