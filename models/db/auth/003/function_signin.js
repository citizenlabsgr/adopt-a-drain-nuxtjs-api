'use strict';

const Step = require('../../../../lib/runner/step');
module.exports = class CreateFunctionSignin extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    this.method = 'POST';
    this.params = 'token TOKEN,credentials JSON';
    this.baseKind = 'base';
    this.baseVersion = baseVersion;
    this.name = 'signin';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params} ) RETURNS JSONB
    AS $$
    Declare _credentials JSONB; -- {"username":"","password"}
    Declare _user_token TOKEN;
    Declare _token JSONB;
    Declare expected_scope TEXT := 'api_user';
    Declare lapse_in_millisec INTEGER := 1800;
    
  BEGIN
    -- [Function: Signin given token and credentials]
    -- [Description: Get a user token given the users credentials]
    -- [Parameter: Credentials is {"username":"user@user.com","password":"<password>"} ]

    -- [Validate Token]
    _token := base_${this.baseVersion}.validate_token(token, 'api_guest') ;

    if _token is NULL then
          -- [Fail 403 When token is invalid]
          return format('{"status":"403","msg":"Forbidden","extra":"Invalid token","user":"%s"}',CURRENT_USER)::JSONB;
    end if;
    
    -- [Validate Credentials]

    _credentials := base_${this.baseVersion}.validate_credentials(credentials::JSONB);

    if _credentials is NULL then
      -- [Fail 400 when credentials are NULL or missing]
      
      return '{"status":"400","msg":"Bad Request"}'::JSONB;
    end if;

    _credentials := _credentials || format('{"scope":"%s"}', expected_scope)::JSONB;

    _user_token := NULL;

    BEGIN
      -- [Verify User Credentials]
      -- [Generate user token]
      --           SELECT public.sign(row_to_json(r), base_${this.baseVersion}.get_jwt_secret(),) AS token into _user_token

          SELECT base_${this.baseVersion}.sign(row_to_json(r), base_${this.baseVersion}.get_jwt_secret()) AS token into _user_token
               FROM (
                 SELECT
                   _token ->> 'aud' as aud,
                   _token ->> 'iss' as iss,
                   _token ->> 'sub' as sub,
                   _credentials ->> 'username' as user,
                   _credentials ->> 'scope' as scope,
                   pk as jti,
                   tk as key,
                   (extract(epoch from now()) + lapse_in_millisec) as exp
                   
                 from base_${this.baseVersion}.one
                 where
                     LOWER(pk) = LOWER(format('username#%s', _credentials ->> 'username'))
                     and sk = 'const#USER'
                     and form ->> 'password' = crypt(_credentials ->> 'password', form ->> 'password')
               ) r;
      
               -- evaluate results
      if _user_token is NULL then
        -- [Fail 404 when User Credentials are not found]
        _credentials := _credentials || '{"password":"********"}'::JSONB;
        return format('{"status":"404","msg":"Not Found","credentials":%s}',_credentials)::JSONB;
      end if;
    EXCEPTION
            when others then
              --RESET ROLE; -- not hobby friendly 
              RAISE NOTICE 'Insert Beyond here there be dragons! %', sqlstate;
              return format('{"status":"%s", "msg":"Unhandled"}', sqlstate)::JSONB;
    END;
    

    -- [Return {status,msg,token}]
    _user_token.id := replace(replace(_user_token.id,'(',''),')','');
    return format('{"status":"200","msg":"OK","token":"%s"}',_user_token.id)::JSONB;

  END;
  
  $$ LANGUAGE plpgsql;
  
  -- GRANT: Grant Execute
  
  /* Doesnt work in Hobby
  
  grant EXECUTE on FUNCTION ${this.name}(TOKEN, JSON) to api_authenticator;
  */
    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.method}`;
  }
};