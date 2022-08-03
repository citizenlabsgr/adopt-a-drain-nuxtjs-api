'use strict';

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionAdopterPost extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);

    this.name = 'page';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, owner OWNER_ID, form JSONB';
    this.method = 'POST';
    this.roles = 'api_admin';
    this.scope = 'api_admin';
    this.pk = "page_id";
    this.sk = "name";
    this.tk = "value";
    this.sql = `
    CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
    
        Declare result JSONB; 
        Declare chelate JSONB := '{"pk":"${this.pk}", 
                                   "sk":"${this.sk}", 
                                   "tk":"${this.tk}", 
                                   "form":"", 
                                   "owner":"*", 
                                   "created":"*", 
                                   "updated":"*", 
                                   "active": true}'::JSONB;
        
    BEGIN
      -- [Function: page given an admin_token TOKEN, OWNER_ID and form JSONB]
      -- [Description: Add a new user by Admin]

      -- [Validate Token]
      result := base_${this.baseVersion}.validate_token(token, '${this.roles}') ;

      if result is NULL then
        -- [Fail 403 When token is invalid]
        -- not available in hobby RESET ROLE;
        return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
      end if;
   
    -- [* Determine the owner value]

    -- if strpos(owner.id, '*') > 0 then
    --   owner := format('(%s)',uuid_generate_v4())::OWNER_ID;
    -- end if;
   

    -- [* Validate form parameter]
      if form is NULL then
          -- [Fail 400 when form is NULL]
          -- not available in hobby RESET ROLE;
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

    -- [* Validate Form]

    -- [* Validate Requred POST form fields]
    --  if not(form ? 'page_id') then
      if not(form ? (chelate ->> 'pk')::TEXT) then
          -- [* Fail 400 when form is missing page_id field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      if not(form ? (chelate ->> 'pk')::TEXT) then
          -- [* Fail 400 when form is missing name field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      if not(form ? (chelate ->> 'pk')::TEXT) then
          -- [* Fail 400 when form is missing value field]
          return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

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