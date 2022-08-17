'use strict';
// const pg = require('pg');
// TO
// OWNER_ID is ("duckduckgoose")
// PRIMARYKEY is ("about","title")

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionDocumentGetToi extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.method = 'GET';
    let groupType = 'page';
    this.name = 'page';
    this.desc = `${this.method} ${this.name} by owner and primarykey`;

    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_guest,api_user,api_admin';
    this.pk = groupType;
    this.sk = 'name';

    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, owner OWNER_ID, id PRIMARYKEY';

    this.sql = `
    -- Get all for a owner
    CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
      Declare result JSONB;
      Declare chelate JSONB ='{"pk":"${this.pk}", 
                               "sk":"${this.sk}"}'::JSONB;
      Declare _result JSONB := '[]'::JSONB;
      Declare _key TEXT;
      Declare _form JSONB;
      Declare countValue INT := -1;
    BEGIN
      -- [Function: get ${this.name} given user_token TOKEN, Owner OWNER_ID, id PRIMARYKEY]

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

      chelate := chelate || format('{"pk":"${this.pk}#%s", "sk": "${this.sk}#%s", "owner":"%s" }', id.pk, id.sk, owner.id)::JSONB;

      -- [Execute update]
      result := base_${this.baseVersion}.query(chelate, owner);
      
      -- [Evaluate count(XXX)]
      FOR _key IN
       SELECT * FROM jsonb_array_elements((result->>'selection')::JSONB)
      LOOP
         _form := (_key::JSONB->>'form')::JSONB;
  
         -- do some math operation on its corresponding value
         
         if strpos((_form->>'value')::TEXT, 'count(') > 0 then
     
             select base_0_0_1.tally(format('("const#%s","*")',replace(replace((_form->>'value')::TEXT, 'count(', ''), ')', ''))::SECONDARYKEY) into countValue;
  
             _form := _form || format('{"value": %s}', countValue::TEXT)::JSONB;
             _key := _key::JSONB || format('{"form": %s}',_form::TEXT)::JSONB;
             
         end if;
         
         _result := _result::JSONB || _key::JSONB;
  
      END LOOP;
      
      result := result || format('{"selection": %s}', _result)::JSONB;
      
      -- [Return {status,msg,selection}]
      return result;

    END;
    $$ LANGUAGE plpgsql;

    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}( TOKEN, OWNER_ID, PRIMARYKEY) to ${this.role};
    */

    `;
    // console.log('CreateFunction \n ', this.sql);
  }
  getName() {
    return `.${this.name}(${this.params}) .${this.method} .${this.role} .${this.desc}.`;
  }
};
