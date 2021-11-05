'use strict';
// const pg = require('pg');

const Step = require('../../../lib/runner/step');
module.exports = class FunctionAdopterGetTIO extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'adopter';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user, api_admin';
    this.pk = 'username';
    this.sk = 'const#USER'; // formerly const#ADOPTER
    
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, id IDENTITY, owner OWNER_ID';
    this.method = 'GET';
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
      Declare result JSONB; 
      Declare chelate JSONB ='{"pk":"replaceme", "sk":"const#USER"}'::JSONB;
    BEGIN
      -- [Function: get ${this.name} given user_token TEXT, id TEXT, owner OWNER_ID]

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
      chelate := chelate || format('{"pk":"username#%s", "owner":"%s" }', id, owner.id)::JSONB;
      
      -- [Execute update]
      result := base_${this.baseVersion}.query(chelate); -- result->> key is owner key

      -- [Return {status,msg,selection}]
      return result;

    END;
    $$ LANGUAGE plpgsql;
    
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN,IDENTITY) to ${this.role};
    */

    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.method}`;
  }
};