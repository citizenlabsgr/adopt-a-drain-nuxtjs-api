'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class RestGet extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'adopter';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user';
    this.pk = 'username';
    this.sk = 'const#USER';
    
    // this.baseKind='base';
    this.baseVersion=baseVersion;

    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(token TEXT, id TEXT)  RETURNS JSONB AS $$
    Declare result JSONB; 
    Declare tmp TEXT;
    BEGIN
          
      -- [Function: get object given user_token TEXT, id TEXT]
      -- [Description: get an existing object]
            
      -- [Validate id parameter]
      if id is NULL then
            -- [Fail 400 when id is NULL]
            return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      -- [Validate Token]
      result := base_${this.baseVersion}.validate_token(token, '${this.role}') ;

      if result is NULL then
            -- [Fail 403 When token is invalid]
            -- not available in hobby RESET ROLE;

            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
      end if;
      
      -- [Verify token has expected scope]
      if not(result ->> 'scope' = '${this.role}') then
              -- [Fail 401 when unexpected scope is detected]
              return '{"status":"401","msg":"Unauthorized"}'::JSONB;
      end if;
      
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

      result := base_${this.baseVersion}.update(chelate, result ->> 'key'); -- result->> key is owner key

      -- [Return {status,msg,updation}]

      return result;

    END;

    $$ LANGUAGE plpgsql;
    
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TEXT,JSON,TEXT) to ${this.role};
    */
    `;
    // console.log('CreateFunction', this.sql);
  }    
};