'use strict';

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionAdopterPost extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'adopter';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, form JSON, owner OWNER_ID';
    this.method = 'POST';
    this.roles = 'api_admin';
    this.scope = 'api_admin';
    this.sql = `
    CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
    
        Declare _form JSONB; 
        Declare result JSONB; 
        Declare chelate JSONB := '{"pk":"username", 
                                   "sk":"const#USER", 
                                   "tk":"*", 
                                   "form":"", 
                                   "owner":"*", 
                                   "created":"*", 
                                   "updated":"*", 
                                   "active": true}'::JSONB;
        
    BEGIN
      -- [Function: adopter given an admin_token TOKEN and form JSON]
      -- [Description: Add a new user by Admin]

      -- [Validate Token]
      result := base_${this.baseVersion}.validate_token(token, '${this.roles}') ;

      if result is NULL then
        -- [Fail 403 When token is invalid]
        -- not available in hobby RESET ROLE;
        return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
      end if;
   
    -- [* Assign owner from parameter]
      chelate := chelate || format('{"owner": "%s"}', owner.id)::JSONB;

    -- [* Assign owner from token]
    
    -- [* Generate owner key]
    -- [* posting existing users is not allowed via api ]
    -- chelate := chelate || format('{"owner": "%s"}', uuid_generate_v4())::JSONB;
    
    -- [* Validate form parameter]
      if form is NULL then
          -- [Fail 400 when form is NULL]
          -- not available in hobby RESET ROLE;
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

    -- [* Validate Form with user's credentials]
      _form := form::JSONB;

    -- [* Validate Requred POST form fields]
      if not(_form ? 'username') then
          -- [* Fail 400 when form is missing username field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      if not(_form ? 'password') then
          -- [* Fail 400 when form is missing password field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      -- [* Hash password]

      _form := _form || format('{"password": "%s"}',crypt(form ->> 'password', gen_salt('bf')) )::JSONB;
      
    -- [* Assign Scope]
      _form := _form || format('{"scope":"%s"}','api_user')::JSONB;

    -- [* Assemble Data]
      chelate := base_${this.baseVersion}.chelate(chelate, _form);

    -- [* Execute insert]
      result := base_${this.baseVersion}.insert(chelate, owner);

    -- [* Return {status,msg,insertion}]
      return result;

    END;

    $$ LANGUAGE plpgsql;
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN,JSON,OWNER_ID) to api_guest;
    */
    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.method}`;
  }
};