'use strict';
// [query by MBR]
// [query by pk, sk]
// [query by pk, sk, owner]

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionQuery extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.version = `${baseName}_${baseVersion}`;
    
    this.name = 'query';
    this.name = `${this.version}.${this.name}`;
    this.params = 'm_b_r MBR';
    this.return = 'JSONB';
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params}) RETURNS ${this.return}

    AS $$
      declare _result JSONB;
      DECLARE mbr BOOLEAN;
    BEGIN
      -- [Function: Query by MBR ]
      -- [Description: MBR search]
    
      BEGIN

        -- if mbr then

           SELECT array_to_json(array_agg(to_jsonb(u))) into _result    
                        FROM base_${baseVersion}.one u    
                        where (u.form->>'lon')::NUMERIC <= m_b_r.east
                              and (u.form->>'lon')::NUMERIC >= m_b_r.west
                              and (u.form->>'lat')::NUMERIC <= m_b_r.north
                              and (u.form->>'lat')::NUMERIC >= m_b_r.south
                              ;
        -- else
    
        --  -- [Fail 400 when unexpecte Search Pattern]
        --  return format('{"status:"400","msg":"Bad Request", "extra":"B%s"}', sqlstate)::JSONB;
    
        -- end if;
    
      EXCEPTION
    
          when others then
            
            return format('{"status":"400","msg":"Bad Request", "extra":"C %s"}',sqlstate)::JSONB;
    
      END;
        
      if _result is NULL then    
        -- [Fail 200 when query results are empty ]

        return '{"status":"404", "msg":"Not Found", "selection": []}'::JSONB;
    
      end if;
    
      -- [Return {status,msg,selection}]
      return format('{"status":"200", "msg":"OK", "selection": %s}', _result)::JSONB;
    
    END;
            
    $$ LANGUAGE plpgsql;
        
         
    
    /* Doesnt work in Hobby
    --grant EXECUTE on FUNCTION ${this.name}(JSONB, TEXT) to api_guest;
    
    grant EXECUTE on FUNCTION ${this.name}(JSONB, TEXT) to api_user;
    
    grant EXECUTE on FUNCTION ${this.name}(JSONB, TEXT) to api_admin;
    */
    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.return}`;
  }
};