'use strict';

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionAdopteePost extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.method = 'POST';
    this.name = 'adoptee';
    this.desc = `${this.method} ${this.name} with form`;
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, form JSONB, owner OWNER_ID';
    
    this.role = 'api_user,api_admin';
    this.scope = 'api_user';

    this.sql = `
    CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
    
    -- Declare _form JSONB; 
    Declare result JSONB; 
    Declare chelate JSONB := '{"pk":"drain_id", 
                               "sk":"const#ADOPTEE", 
                               "tk":"*", 
                               "form":"", 
                               "owner":"*", 
                               "created":"*", 
                               "updated":"*", 
                               "active": true}'::JSONB;
    
    BEGIN
      -- [Function: adoptee given an user_token TOKEN and form JSON, and owner OWNER_ID]
      -- [Description: Add a new user by Admin]

      -- [Validate Token]
      result := base_${this.baseVersion}.validate_token(token, '${this.role}') ;

      if result is NULL then
        -- [Fail 403 When token is invalid]
        -- not available in hobby RESET ROLE;
        return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
      end if;

    -- [* Assign owner from parameter]
      chelate := chelate || format('{"owner": "%s"}', owner.id)::JSONB;

    -- [* Verify token has expected scope]

    -- [* Validate form parameter]
      
      if form is NULL then
          -- [Fail 400 when form is NULL]
          -- not available in hobby RESET ROLE;
          return '{"status":"400","msg":"Bad Request","issue":"form is NULL"}'::JSONB;
      end if;

    -- [* Validate Form]
      
      -- form := form::JSONB;
    
    -- [* Validate Requred POST form fields]
     
      if not(form ? 'lon') then
          -- [* Fail 400 when form is missing lon field]
          return '{"status":"400","msg":"Bad Request","issue":"form missing lon"}'::JSONB;
      end if;

      if not(form ? 'lat') then
          -- [* Fail 400 when form is missing lat field]
          return '{"status":"400","msg":"Bad Request","issue":"form missing lat"}'::JSONB;
      end if;
      if not(form ? 'name') then
          -- [* Fail 400 when form is missing name field]
          return '{"status":"400","msg":"Bad Request","issue":"form missing name"}'::JSONB;
      end if;
      if not(form ? 'type') then
          -- [* Fail 400 when form is missing type field]
          return '{"status":"400","msg":"Bad Request","issue":"form missing type"}'::JSONB;
      end if;      
      if not(form ? 'drain_id') then
          -- [* Fail 400 when form is missing drain_id field]
          return '{"status":"400","msg":"Bad Request"},"issue":"form missing drain_id"'::JSONB;
      end if;       
      
      --if not(form ? 'adopter_key') then
      --    -- [* Fail 400 when form is missing adopter_key field]
      --    return '{"status":"400","msg":"Bad Request","issue":"form missing adopter_key"}'::JSONB;
      --end if;  
      
    -- [* Assemble Data]
      chelate := base_${this.baseVersion}.chelate(chelate, form); -- add form to chelate, generate owner_key

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
  }    
  getName() {
    return `.${this.name}(${this.params}) .${this.method} .${this.role} .${this.desc}.`;
  }
};