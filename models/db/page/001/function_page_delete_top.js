'use strict';
// const pg = require('pg');
// PRIMARYKEY is (pk,sk)
// PRIMARYKEY is ("about","title")

// {pk: "<group-type>#<group-name>", sk: "<>", tk: "", form:{id: "<string>", name: "<string>", value: "<string>"}, owner: "<string>", active: <boolean>, created:"<datetime>", updated:"<datetime>"}
const Step = require('../../../../lib/runner/step');
module.exports = class FunctionPageDelete extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;

    let groupType = 'page';
    this.name = `${this.kind}_${this.version}.${groupType}_del`;

    this.desc = `Delete ${this.name} by owner and primarykey`;

    this.role = 'api_admin';
    this.scope = 'api_admin';
    this.pk = groupType; // `${groupType}`; // 'page _id';
    this.sk = 'name';
    
    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, _owner OWNER_ID, id PRIMARYKEY';

    this.method = 'DELETE';
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
 
    Declare result JSONB; 
    Declare tmp TEXT;
    Declare criteria JSONB ='{"pk":"${this.pk}", "sk":"${this.sk}"}'::JSONB;
    BEGIN
      -- [Function: get api_${this.version}.page given user_token TOKEN, _owner OWNER_ID, id PRIMARYKEY]
      -- [Description: get an existing api_${this.version}.page]
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
      -- pk=id.pk and sk=id.sk delete one
      -- pk=id.pk and sk='*'   delete all pk
      criteria := criteria || format('{"pk":"${this.pk}#%s", "sk": "${this.sk}#%s"}', id.pk, id.sk)::JSONB;
      
      -- [Execute delete]
      result := base_${this.baseVersion}.delete(criteria, _owner);

      -- [Return {status,msg,selection}]
      return result;

    END;

    $$ LANGUAGE plpgsql;
    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN, OWNER_ID, IDENTITY) to ${this.role};
    */
    `;
  }    
  getName() {
    return `.${this.name}(${this.params}) .${this.method} .${this.role} .${this.desc} .`;
  }
};