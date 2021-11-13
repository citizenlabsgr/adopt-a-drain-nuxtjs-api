'use strict';
// const pg = require('pg');

const Step = require('../../../lib/runner/step');
module.exports = class FunctionAdopteeGet extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'adoptee';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user';
    this.pk = 'drain_id';
    this.sk = 'const#ADOPTEE'; 
    
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TEXT, owner OWNER_ID';
    this.method = 'GET';

    this.sql = `

    CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
      Declare result JSONB; 
      Declare chelate JSONB ='{"pk":"${this.pk}", "sk":"${this.sk}"}'::JSONB;
    BEGIN
          
      -- [Function: get ${this.name} given user_token TEXT, owner OWNER_ID]
      -- [Description: get an existing api_0_0_1.adoptee]
            
      -- [Validate id parameter]
      if owner is NULL then
            -- [Fail 400 when owner is NULL]
            return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      -- [Validate Token]
      result := base_${this.baseVersion}.validate_token(token, '${this.role}') ;

      if result is NULL then
            -- [Fail 403 When token is invalid]
            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
      end if;
      
      -- [Assemble Data] 
      
      -- [Execute update]
      -- result := ${this.name}(token, id, result ->> 'key') ;
      result := ${this.name}(token, owner.id) ;

      -- [Return {status,msg,selection}]

      return result;

    END;
    $$ LANGUAGE plpgsql;

    CREATE OR REPLACE FUNCTION ${this.name}(${this.params}, owner OWNER_ID)  RETURNS JSONB AS $$
      Declare result JSONB; 
      Declare chelate JSONB ='{"pk":"${this.pk}", "sk":"${this.sk}"}'::JSONB;
    BEGIN
      -- [Function: get ${this.name} given user_token TEXT, id TEXT, owner OWNER_ID]

      -- [Validate id parameter]
      if id is NULL then
            -- [Fail 400 when id is NULL]
            return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;

      -- [Validate Token]
      result := base_${this.baseVersion}.validate_token(token, '${this.role},api_admin') ;

      if result is NULL then
            -- [Fail 403 When token is invalid]
            return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
      end if;

      -- [Assemble Data] 
      chelate := chelate || format('{"pk":"${this.pk}#%s", "owner":"%s" }', id, owner.id)::JSONB;
      
      -- [Execute update]
      result := base_${this.baseVersion}.query(chelate); -- result->> key is owner key

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