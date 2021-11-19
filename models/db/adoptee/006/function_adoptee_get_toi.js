'use strict';
// const pg = require('pg');
// TO
const Step = require('../../../../lib/runner/step');
module.exports = class FunctionAdopteeGetToi extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.method = 'GET';

    this.name = 'adoptee';
    this.desc = `${this.method} ${this.name} by owner and identity`;

    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user, api_admin';
    this.pk = 'drain_id';
    this.sk = 'const#ADOPTEE'; 
    
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, owner OWNER_ID, id IDENTITY';

    this.sql = `
    -- Get all for a owner
    CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
      Declare result JSONB; 
      Declare chelate JSONB ='{"pk":"${this.pk}", "sk":"${this.sk}"}'::JSONB;
    BEGIN
      -- [Function: get ${this.name} given user_token TOKEN, Owner OWNER_ID, id IDENTITY]

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
      chelate := chelate || format('{"pk":"${this.pk}#%s", "owner":"%s" }', id.id, owner.id)::JSONB;
      
      -- [Execute update]
      result := base_${this.baseVersion}.query(chelate, owner); 

      -- [Return {status,msg,selection}]
      return result;

    END;
    $$ LANGUAGE plpgsql;
    
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}( TOKEN, OWNER_ID, IDENTITY) to ${this.role};
    */

    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `.${this.name}(${this.params}) .${this.method} .${this.role} .${this.desc}.`;
  }
};