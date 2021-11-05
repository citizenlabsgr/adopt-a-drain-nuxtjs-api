'use strict';
// const pg = require('pg');
// TO
const Step = require('../../../../lib/runner/step');
module.exports = class FunctionAdopteeGetTo extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'adoptee';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user,api_admin';
    this.pk = 'drain_id';
    this.sk = 'const#ADOPTEE'; 
    
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, owner OWNER_ID';
    this.method = 'GET';

    this.sql = `
    -- Get all adoptee for an owner by owner
    -- use token key for id 
    -- {pk: sk: tk:}
    CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
      Declare result JSONB; 
      Declare chelate JSONB ='{"sk":"${this.sk}","tk":"*"}'::JSONB;

    BEGIN
      -- [Function: get ${this.name} given user_token TOKEN, owner OWNER_ID]

      -- [Validate id parameter]
      if owner is NULL then
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
      chelate := chelate || format('{"owner":"%s" }', owner.id)::JSONB;

      -- [Execute update]
      result := base_${this.baseVersion}.query(chelate, owner); 

      -- [Return {status,msg,selection}]
      return result;

    END;
    $$ LANGUAGE plpgsql;
    
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN,OWNER_ID) to ${this.role};
    */

    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.method}`;
  }
};