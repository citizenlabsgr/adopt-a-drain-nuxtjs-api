'use strict';

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionDocumentDeleteToi extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'document_del';
    this.desc = `Delete ${this.name} by identity`;
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.role = 'api_admin';
    this.scope = 'api_admin';
    this.pk = 'id';// 'doc_id';
    this.sk = '*';

    this.baseKind='base';
    this.baseVersion=baseVersion;
    this.params = 'token TOKEN, owner_key OWNER_ID, id PRIMARYKEY';

    this.method = 'DELETE';
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params})  RETURNS JSONB AS $$
        Declare result JSONB;
        Declare criteria JSONB ='{"pk":"${this.pk}", "sk":"*"}'::JSONB;
        BEGIN
          -- [Function: get api_${this.version}.document given user_token TOKEN, owner_key OWNER_ID, id PRIMARYKEY]
          -- [Description: get an existing api_${this.version}.document]
          -- [Note: Only the owner can delete]
          -- [Validate id parameter]
          if id is NULL then
                -- [Fail 400 when id is NULL]
                return '{"status":"400","msg":"Bad Request"}'::JSONB;
          end if;

          -- [Validate Token]

          result := base_${this.baseVersion}.validate_token(token, 'api_admin') ;
          if result is NULL then
                -- [Fail 403 When token is invalid]
                return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
          end if;

          -- [Assemble Data]

          criteria := criteria || format('{"pk":"${this.pk}#%s"}', id.pk)::JSONB;

          -- [Execute delete]

          BEGIN
    	      Delete from base_${this.baseVersion}.one
    	        where lower(pk)=lower(criteria ->> 'pk')
    	        and owner=owner_key.id;

    	      result := format('{"status":"200", "msg":"OK", "criteria":%s, "deletion":{}}',criteria)::JSONB ;
          EXCEPTION
                  when others then
                    RAISE NOTICE '5 Beyond here there be dragons! %', sqlstate;
                    return format('{"status":"%s", "msg":"Internal Server Error", "criteria":%s}',sqlstate,criteria)::JSONB ;
          END;

          -- [Return {status,msg,selection}]
          return result;

        END;

        $$ LANGUAGE plpgsql;

    /* Doesnt work in Hobby
    grant EXECUTE on FUNCTION ${this.name}(TOKEN, OWNER_ID, PRIMARYKEY) to ${this.role};
    */
    `;
    // console.log('Create\n', this.sql);
  }
  getName() {
    return `.${this.name}(${this.params}) .${this.method} .${this.role} .${this.desc} .`;
  }
};
