'use strict';
// const pg = require('pg');

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionAdopterDeleteTv extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'adopter';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user';
    this.scope = 'api_user';
    this.pk = 'username';
    this.sk = 'const#USER'; // formerly const#ADOPTER
    
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, id VARCHAR';
    this.method = 'DELETE';
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
 
    Declare result JSONB; 
    Declare tmp TEXT;
    Declare criteria JSONB ='{"pk":"<id>", "sk":"${this.sk}"}'::JSONB;
    Declare owner_id OWNER_ID;
    BEGIN
      -- [Function: get api_${this.version}.adopter given user_token TOKEN, id VARCHAR]
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
      
      -- [Assemble Data] 
      criteria := criteria || format('{"pk":"${this.pk}#%s"}', id)::JSONB;
      
      -- [Execute delete]
      result := base_${this.baseVersion}.delete(criteria, format('("%s")',result ->> 'key')::OWNER_ID);

      -- [Return {status,msg,selection}]
      return result;

    END;

    $$ LANGUAGE plpgsql;
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN,VARCHAR) to ${this.role};
    */
    `;
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.method}`;
  }
};