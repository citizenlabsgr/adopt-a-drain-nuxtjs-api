'use strict';

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionDocumentPostToj extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.method = 'POST';
    this.name = 'document';
    this.desc = `${this.method} ${this.name} with form`;
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, owner OWNER_ID, form JSONB';
    
    this.role = 'api_admin';
    this.scope = 'api_admin';

    this.sql = `
    CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
    
    Declare result JSONB; 
    Declare chelate JSONB := '{"pk":"doc_id", 
                               "sk":"i", 
                               "tk":"w", 
                               "form":"", 
                               "owner":"*", 
                               "created":"*", 
                               "updated":"*", 
                               "active": true}'::JSONB;
    
    BEGIN
      -- [Function: document given an user_token TOKEN, owner OWNER_ID and form JSON]
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
      
    -- [* Validate Requred POST form fields]
     
      if not(form ? 'p') then
          -- [* Fail 400 when form is missing p field]
          return '{"status":"400","msg":"Bad Request"},"issue":"form missing p"'::JSONB;
      end if;       
      
      if not(form ? 'i') then
          -- [* Fail 400 when form is missing i field]
          return '{"status":"400","msg":"Bad Request"},"issue":"form missing i"'::JSONB;
      end if;

      if not(form ? 'w') then
          -- [* Fail 400 when form is missing w field]
          return '{"status":"400","msg":"Bad Request"},"issue":"form missing w"'::JSONB;
      end if;
      
    -- [* Assemble Data]
      chelate := base_${this.baseVersion}.chelate(chelate, form); -- add form to chelate, generate owner_key

    -- [* Execute insert]
      result := base_${this.baseVersion}.insert(chelate, owner);

    -- [* Return {status,msg,insertion}]
      return result;

    END;
    $$ LANGUAGE plpgsql;
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN, OWNER_ID, JSONB) to api_guest;
    */
    `;
  }    
  getName() {
    return `.${this.name}(${this.params}) .${this.method} .${this.role} .${this.desc}.`;
  }
};