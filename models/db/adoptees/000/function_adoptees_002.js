'use strict';
// const pg = require('pg');
// [* Version this class ]
const Step = require('../../lib/runner/step');
module.exports = class FunctionAdoptees001 extends Step {
  constructor(apiName, apiVersion, baseVersion) {
    super(apiName, apiVersion);

    this.method = 'GET';
    this.params = 'token TOKEN, mbr JSON';
    this.baseKind = 'base';
    this.baseVersion = baseVersion;

    this.name = 'adoptees';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params}) RETURNS JSONB
    AS $$
      Declare _mbr JSONB; -- {"west":0.0,"east","north":0.0,"south":0.0}
      Declare _adoptees JSONB;
      Declare _token JSONB;
      Declare _expected_scope TEXT := 'api_user';
  
    BEGIN
      -- [Function: Retrieve Adoptees given guest TOKEN and a MBR]
      -- [Description: Get adoptees in a given a minimum bounding rectangle]
      -- [Parameter: mbr is {"west":0.0,"east","north":0.0,"south":0.0} ]  
      -- [Validate Token]
      
      _token := ${this.baseKind}_${this.baseVersion}.validate_token(token, 'api_guest');
      
      if _token is NULL then 
        -- [Fail 403 when token is invalid]
        --RESET ROLE; -- not hobby friendly 
        return '{"status":"403","msg":"Forbidden","extra":"invalid token"}'::JSONB;
      end if;
  
      -- [Switch Role]

      -- [Validate MBR and return on failure]
      _mbr := mbr::JSONB;
      if not(_mbr ? 'west' and _mbr ? 'east' and _mbr ? 'north' and _mbr ? 'south') then
        _mbr = NULL;
      end if;

      if _mbr is NULL then
        -- [Fail 400 when MBR is NULL or missing]
        return format('{"status":"400","msg":"Bad Request", mbr: %s}', mbr)::JSONB;
      end if;
  
      BEGIN
        -- [* select drains within a MBR]
        
        select ${this.baseKind}_${this.baseVersion}.query(format('{"sk": "const#ADOPTEE", "tk":"*", "mbr": %s}', mbr)::JSONB) into _adoptees;

        -- evaluate results
        if _adoptees is NULL then
          -- [Fail 404 when User Credentials are not found]
          return format('{"status":"404","msg":"Not Found","extra":"null mbr","mbr":%s}',_mbr)::JSONB;
        end if;
      EXCEPTION
              when others then
                RAISE NOTICE 'Insert Beyond here there be dragons! %', sqlstate;
                return format('{"status":"%s", "msg":"Unhandled"}', sqlstate)::JSONB;
      END;
      
      -- [Return {status,msg,token}]
      -- return format('{"status":"200","msg":"OK","adoptees": %s}',_adoptees)::JSONB;
      return _adoptees;
    END;
  
  $$ LANGUAGE plpgsql;
  
  -- GRANT: Grant Execute
  
  -- Doesnt work in Hobby
  
  -- grant EXECUTE on FUNCTION ${this.name}(TEXT, JSON) to api_authenticator;
  
    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.method}`;
  }
};