'use strict';
// const pg = require('pg');

const Step = require('../../../../lib/runner/step');
module.exports = class CreateFunctionUpdateJOP extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'update';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.params = 'chelate JSONB, _owner OWNER_ID, id PRIMARYKEY';
    this.return = 'JSONB';
    this.sql = `
    CREATE OR REPLACE FUNCTION ${this.name}(${this.params}) RETURNS JSONB
      AS $$

      declare _result record;
  
    BEGIN
  
        -- [Function: Update  with Chelate like {pk,sk,form}]
        -- [Description: General update]
        -- [Chelate requires {pk,sk,tk,form} ]
        -- [form is full {username,displayname,password}]
        -- have to merge chelate.form with existing record form
        -- handles partial chelate pk,sk, form (no tk)
        
        -- [Validate Parameter (chelate)]
  
        if chelate is NULL then
            -- [Fail 400 when a parameter is NULL]
            return '{"status":"400","msg":"Bad Request", "extra":"update has undefined chelate"}'::JSONB;
        end if;
      
        -- [Pk, sk, tk, and form required]
        if not(chelate ? 'pk'
              and chelate ? 'sk'
              and chelate ? 'tk'
              and chelate ? 'form') then
          -- [Fail 400 when pk, sk or form are missing ]
          return '{"status":"400", "msg":"Bad Request", "extra":"update has invalid chelate"}'::JSONB;
        end if;
  
        update base_0_0_1.one
         set
          pk=chelate->>'pk',
          sk=chelate->>'sk',
          tk=chelate->>'tk',
           form = form || (chelate ->> 'form')::JSONB,
           updated = NOW()
         where
           pk = id.pk
           and sk = id.sk
           and owner = _owner.id
           returning * into _result;
  
        if not(FOUND) then
             -- [Fail 404 when given chelate is not found]
             return format('{"status":"404", "msg":"Not Found", "extra":"D", "key":"%s", "pk":"%s", "sk":"%s"}',_owner.id, id.pk, id.sk)::JSONB;
  
        end if;
  
        -- [Return {status,msg,updation}]
  
        return format('{"status":"200","msg":"OK","updation":%s}',(to_jsonb(_result) #- '{form,password}')::TEXT)::JSONB;

    END;

  $$ LANGUAGE plpgsql;     
  
  /* Doesnt work in Hobby
  grant EXECUTE on FUNCTION ${this.name}(JSONB,OWNER_ID,PRIMARYKEY) to api_user;
  */
    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.return}`;
  }
};