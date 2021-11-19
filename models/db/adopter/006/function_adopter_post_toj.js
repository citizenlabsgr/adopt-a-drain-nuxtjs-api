'use strict';

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionAdopterPost extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    this.name = 'adopter';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, owner OWNER_ID, form JSONB';
    this.method = 'POST';
    this.roles = 'api_admin';
    this.scope = 'api_admin';
    this.sql = `
    CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
    
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
      -- [Function: adopter given an admin_token TOKEN, OWNER_ID and form JSONB]
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

    -- [* Validate Requred POST form fields]
      if not(form ? 'username') then
          -- [* Fail 400 when form is missing username field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      if not(form ? 'password') then
          -- [* Fail 400 when form is missing password field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      -- [* Hash password]

      form := form || format('{"password": "%s"}',crypt(form ->> 'password', gen_salt('bf')) )::JSONB;
      
    -- [* Assign Scope]
      form := form || format('{"scope":"%s"}','api_user')::JSONB;

    -- [* Assemble Data]
      chelate := base_${this.baseVersion}.chelate(chelate, form);

    -- [* Execute insert]
      result := base_${this.baseVersion}.insert(chelate, owner);

    -- [* Return {status,msg,insertion}]
      return result;

    END;

    $$ LANGUAGE plpgsql;
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN,OWNER_ID,JSONB) to api_guest;
    */
    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.method}`;
  }
};