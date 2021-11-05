'use strict';
// const pg = require('pg');
// TO
const Step = require('../../../../lib/runner/step');
module.exports = class FunctionAdopteeGetTi extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'adoptee';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user, api_admin';
    this.pk = 'drain_id';
    this.sk = 'const#ADOPTEE'; 
    
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, id IDENTITY';
    this.method = 'GET';

    this.sql = `
    -- Get all for a owner
    CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
      Declare result JSONB; 
      Declare chelate JSONB ='{"pk":"${this.pk}", "sk":"${this.sk}"}'::JSONB;
    BEGIN
      -- [Function: get ${this.name} given user_token TEXT, id TEXT]

      -- [Validate id parameter]
      if id is NULL then
            -- [Fail 400 when id is NULL]
            return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;
      -- [Validate owner _id parameter]
      -- if owner_ id is NULL then
      --      -- [Fail 400 when id is NULL]
      --      return '{"status":"400","msg":"Bad Request"}'::JSONB;
      -- end if;
      -- [Validate Token]
      result := base_${this.baseVersion}.validate_token(token, '${this.role}') ;

      if result is NULL then
            -- [Fail 403 When token is invalid]
            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
      end if;

      -- [Assemble Data] 
      chelate := chelate || format('{"pk":"${this.pk}#%s", "owner":"%s" }', id.id, result ->> 'key')::JSONB;
      
      -- [Execute update]
      result := base_${this.baseVersion}.query(chelate, format('("%s")',result ->> 'key')::OWNER_ID); 

      -- [Return {status,msg,selection}]
      return result;

    END;
    $$ LANGUAGE plpgsql;
    
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TEXT,TEXT) to ${this.role};
    */

    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.method}`;
  }
};