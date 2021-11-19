'use strict';
// const pg = require('pg');
// TO
const Step = require('../../../../lib/runner/step');
module.exports = class FunctionAdopteeGetTmbr extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    
    this.method = 'GET';

    this.name = 'adoptee';
    this.desc = `${this.method} ${this.name} by mbr`;

    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_user, api_admin, api_guest';
    this.pk = 'drain_id';
    this.sk = 'const#ADOPTEE'; 
    this.tk = '*';
    
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, m_b_r MBR';
    // pk sk
    // pk sk 
    // sk tk* mbr default search
    this.sql = `
    
    CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
      Declare result JSONB; 
      Declare chelate JSONB ='{"sk":"${this.sk}", "tk":"${this.tk}"}'::JSONB;
    BEGIN
      -- [Function: get ${this.name} given ${this.params}]

      -- [Validate id parameter]
    

      -- [Validate Token]
      result := base_${this.baseVersion}.validate_token(token, '${this.role}') ;

      if result is NULL then
            -- [Fail 403 When token is invalid]
            return '{"status":"403","msg":"Forbidden","issue":"Invalid token"}'::JSONB;
      end if;
  
      -- [Execute update]
      -- owner can be anything
      result := base_${this.baseVersion}.query(m_b_r); 

      -- [Return {status,msg,selection}]
      return result;

    END;
    $$ LANGUAGE plpgsql;
    
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN, MBR) to ${this.role};
    */

    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `.${this.name}(${this.params}) .${this.method} .${this.role} .${this.desc}.`;
  }
};