'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class FunctionAdopterDelete extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'adopter';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user api_admin';
    this.scope = 'api_user';
    this.pk = 'username';
    this.sk = 'const#USER'; // formerly const#ADOPTER
    
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TEXT, id VARCHAR, owner TEXT';
    this.method = 'DELETE';
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
 
    Declare result JSONB; 
    Declare tmp TEXT;
    Declare criteria JSONB ='{"pk":"<id>", "sk":"const#USER"}'::JSONB;
    BEGIN
      -- [Function: get api_${this.version}.adopter given user_token TEXT, id VARCHAR, owner TEXT]
      -- [Description: get an existing api_${this.version}.adopter]
      -- [Note: Only the owner can delete]       
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
      --if not(result ->> 'scope' = 'api_user') then
      --        -- [Fail 401 when unexpected scope is detected]
      --        return '{"status":"401","msg":"Unauthorized"}'::JSONB;
      --end if;
      
      -- [Assemble Data] 
      criteria := criteria || format('{"pk":"username#%s"}', id)::JSONB;
      
      -- [Execute delete]
      result := base_${this.baseVersion}.delete(criteria, owner);

      -- result := base_${this.baseVersion}.delete(criteria, result ->> 'key');
      -- result := base_${this.baseVersion}.delete(criteria, id); 

      -- [Return {status,msg,selection}]
      return result;

    END;

    $$ LANGUAGE plpgsql;
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TEXT,VARCHAR) to ${this.role};
    */
    `;
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.method}`;
  }
};