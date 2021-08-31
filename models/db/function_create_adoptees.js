/*
'use strict';
// const pg = require('pg');

const Step = require('../../lib/runner/step');
module.exports = class CreateFunctionSignin extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    this.baseKind = 'base';
    this.baseVersion = baseVersion;
    this.name = 'adoptees';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(guest_token TEXT, mbr JSON) RETURNS JSONB

    AS $$
  
      Declare _mbr JSONB; -- {"west":0.0,"east","north":0.0,"south":0.0}
  
      Declare _adoptees ;
  
      Declare _token JSONB;
      Declare _expected_scope TEXT := 'api_user';
  
    BEGIN
      -- [Function: Retrieve Adoptees given guest token and MBR]
      -- [Description: Get adoptees in a given a minimum bounding rectangle]
      -- expect user to be connected as api_authenticator
      -- [Parameter: mbr is {"west":0.0,"east","north":0.0,"south":0.0} ]
      -- not supported under Hobby
      -- set role api_ guest;
  
      -- [Validate Token]
      _token = ${this.baseKind}_${this.baseVersion}.validate_token(guest_token, 'api_guest');
      if _token is NULL then 
        -- [Fail 403 when token is invalid]
        --RESET ROLE; -- not hobby friendly 
        return '{"status":"403","msg":"Forbidden","extra":"invalid token"}'::JSONB;
      end if;
  
      -- [Switch Role]
      -- not supported under Hobby
      --set role api_ guest; -- api_authenticator allows this switch but doesnt dictate it
      
      -- [Validate MBR]
      -- _mbr := ${this.baseKind}_${this.baseVersion}.validate_credentials(credentials::JSONB);
      _mbr := mbr::JSONB;
      if not(_mbr ? 'west' and _mbr ? 'east' and _mbr ? 'north' and _mbr ? 'south') then
        _mbr = NULL;
      end if;

      if _mbr is NULL then
        -- [Fail 400 when MBR is NULL or missing]
        --RESET ROLE; -- not hobby friendly 
        return '{"status":"400","msg":"Bad Request"}'::JSONB;
      end if;
  
      -- _adoptees := NULL;
  
      BEGIN
        -- [Verify User Credentials]

            SELECT ${this.baseKind}_${this.baseVersion}.sign(row_to_json(r), ${this.baseKind}_${this.baseVersion}.get_jwt_secret()) AS token into _user_token
                 FROM (
                   SELECT
                     _token ->> 'aud' as aud,
                     _token ->> 'iss' as iss,
                     _token ->> 'sub' as sub,
                     _credentials ->> 'username' as user,
                     _credentials ->> 'scope' as scope,
                     pk as jti,
                     tk as key
                   from ${this.baseKind}_${this.baseVersion}.one
                   where
                       LOWER(pk) = LOWER(format('username#%s', _credentials ->> 'username'))
                       and sk = 'const#USER'
                       and form ->> 'password' = crypt(_credentials ->> 'password', form ->> 'password')
                 ) r;
        -- evaluate results
        if _user_token is NULL then
          -- [Fail 404 when User Credentials are not found]
          --RESET ROLE; -- not hobby friendly 
          _credentials := _credentials || '{"password":"********"}'::JSONB;
          return format('{"status":"404","msg":"Not Found","extra":"null token","credentials":%s}',_credentials)::JSONB;
        end if;
      EXCEPTION
              when others then
                --RESET ROLE; -- not hobby friendly 
                RAISE NOTICE 'Insert Beyond here there be dragons! %', sqlstate;
                return format('{"status":"%s", "msg":"Unhandled"}', sqlstate)::JSONB;
      END;
      --RESET ROLE; -- not hobby friendly 
      -- calculate the token
      -- [Return {status,msg,token}]
      return format('{"status":"200","msg":"OK","adoptees":"%s"}',_user_token)::JSONB;
  
    END;
  
  $$ LANGUAGE plpgsql;
  
  -- GRANT: Grant Execute
  
  -- Doesnt work in Hobby
  
  -- grant EXECUTE on FUNCTION ${this.name}(TEXT, JSON) to api_authenticator;
  
    `;
    // console.log('CreateFunction', this.sql);
  }    
};
*/