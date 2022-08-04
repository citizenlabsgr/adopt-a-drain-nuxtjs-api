'use strict';
// [query by MBR]
// [query by pk, sk]
// [query by pk, sk, owner]
// query(PrimaryKey, OwnerId)
// query(SecondaryKey, OwnerId)
// query(TertiaryKey, OwnerId)

const Step = require('../../../../lib/runner/step');
module.exports = class FunctionQuery extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.version = `${baseName}_${baseVersion}`;

    this.name = 'query';
    this.name = `${this.version}.${this.name}`;
    this.params = 'chelate JSONB, owner_key OWNER_ID';
    this.return = 'JSONB';
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params}) RETURNS ${this.return}

    AS $$
      declare _result JSONB;
      --DECLARE _chelate JSONB;
      DECLARE pk BOOLEAN;
      DECLARE sk BOOLEAN;
      DECLARE tk BOOLEAN;
      DECLARE xk BOOLEAN;
      DECLARE yk BOOLEAN;
      DECLARE owner BOOLEAN;
      DECLARE mbr BOOLEAN;
    BEGIN
      -- [Function: Query by chelate like {pk,sk},{sk,tk}, or {xk,yk}]
      -- [Description: General search]
      -- select by pk and sk
      -- or sk and tk
      -- use wildcard * in any position
      -- chelate is {pk:"", sk:""}
      --            or {sk:"", tk:""}
      --            or {xk:"", yk:""}
      --            or {pk:"", sk:"", mbr:{west:0.0,east:0.0,north:0.0,south:0.0}}
      --            or {sk:"", tk:"", mbr:{west:0.0,east:0.0,north:0.0,south:0.0}}
      --            or {xk:"", yk:"", mbr:{west:0.0,east:0.0,north:0.0,south:0.0}}
      -- [Validate parameters (chelate)]

      if chelate is NULL then

        -- [Fail 400 when a parameter is NULL]
        return format('{"status":"400","msg":"Bad Request", "extra":"A", "chelate": %s}',chelate)::JSONB;

      end if;

      -- chelate := chelate::JSONB;
      pk := chelate ? 'pk';
      sk := chelate ? 'sk';
      tk := chelate ? 'tk';
      xk := chelate ? 'xk';
      yk := chelate ? 'yk';
      owner := chelate ? 'owner';
      mbr := chelate ? 'mbr';
      -- set to ignore owner on select
      if owner then
        if chelate ->> 'owner' = '0' then
          owner := false;
        end if;
      end if;

      BEGIN
      
        -- [Note sk, tk, yk key may contain wildcards *]
        -- [Remove password when found]

      -- [Note sk, tk, yk key may contain wildcards *]
      -- strpos(chelate ->> 'sk', '*') > 0
      --       if pk and sk and owner and mbr and chelate ->> 'sk' = '*' then
      
      if pk and sk and owner and mbr and strpos(chelate ->> 'sk', '*') > 0 then
          -- 	format('{"pk":"","sk":"*","owner":"","mbr":%s}',mbr)::JSONB;
        raise notice 'A';
        --_result := '[{"res":"A"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                        FROM base_${baseVersion}.one u
                        where lower(u.pk) = lower(chelate ->> 'pk')
                              and u.owner = owner_key.id
                          and u.form->>'lon' <= (chelate->>'mbr')::JSONB->>'east'
                              and u.form->>'lon' >= (chelate->>'mbr')::JSONB->>'west'
                              and u.form->>'lat' <= (chelate->>'mbr')::JSONB->>'north'
                              and u.form->>'lat' >= (chelate->>'mbr')::JSONB->>'south'
                              ;

      elsif pk and sk and owner and mbr then
        -- 	format('{"pk":"","sk":"","owner":"","mbr":%s}',mbr)::JSONB;
          -- raise notice 'B';
          -- _result := '[{"res":"B"}]';
          SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                        FROM base_${baseVersion}.one u
                        where lower(u.pk) = lower(chelate ->> 'pk')
                          and u.owner = owner_key.id
                          and u.form->>'lon' <= (chelate->>'mbr')::JSONB->>'east'
                          and u.form->>'lon' >= (chelate->>'mbr')::JSONB->>'west'
                          and u.form->>'lat' <= (chelate->>'mbr')::JSONB->>'north'
                          and u.form->>'lat' >= (chelate->>'mbr')::JSONB->>'south'
                        ;
      elsif pk and sk and mbr and strpos(chelate ->> 'sk', '*') > 0 then
        -- 	format('{"pk":"","sk":"*","mbr":%s}',mbr)::JSONB;
        -- raise notice 'C';
        --_result := '[{"res":"C"}]';

         SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                        FROM base_${baseVersion}.one u
                        where lower(u.pk) = lower(chelate ->> 'pk')
                          and u.form->>'lon' <= (chelate->>'mbr')::JSONB->>'east'
                          and u.form->>'lon' >= (chelate->>'mbr')::JSONB->>'west'
                          and u.form->>'lat' <= (chelate->>'mbr')::JSONB->>'north'
                          and u.form->>'lat' >= (chelate->>'mbr')::JSONB->>'south'
                        ;


      elsif pk and sk and mbr then
        -- 	format('{"pk":"","sk":"","mbr":%s}',mbr)::JSONB;
        -- raise notice 'D';
        --_result := '[{"res":"D"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
	                        FROM base_0_0_1.one u
	                        where lower(u.pk) = lower(chelate ->> 'pk')
	                          and u.sk = chelate ->> 'sk'
	                          and u.form->>'lon' <= (chelate->>'mbr')::JSONB->>'east'
	                          and u.form->>'lon' >= (chelate->>'mbr')::JSONB->>'west'
	                          and u.form->>'lat' <= (chelate->>'mbr')::JSONB->>'north'
	                          and u.form->>'lat' >= (chelate->>'mbr')::JSONB->>'south'
	                        ;

      elsif pk and sk and owner and strpos(chelate ->> 'sk', '*') > 0 then
        -- 	'{"pk":"","sk":"*","owner":""}'::JSONB
        -- raise notice 'E';
        -- _result := '[{"res":"E"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                        FROM base_${baseVersion}.one u
                        where lower(u.pk) = lower(chelate ->> 'pk')
                              and u.owner = owner_key.id;

      elsif pk and sk and owner then
          -- 	'{"pk":"","sk":"","owner":""}'::JSONB
        -- raise notice 'F';
        --_result := '[{"res":"F"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                        FROM base_${baseVersion}.one u
                        where lower(u.pk) = lower(chelate ->> 'pk')
                              and u.sk = chelate ->> 'sk'
                              and u.owner = owner_key.id;

      elsif pk and sk and strpos(chelate ->> 'sk', '*') > 0 then
        -- 	'{"pk":"","sk":"*"}'::JSONB
        -- raise notice 'G';
        -- _result := '[{"res":"G"}]';

        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                        FROM base_${baseVersion}.one u
                        where lower(u.pk) = lower(chelate ->> 'pk');

      elsif pk and sk then
        -- 	'{"pk":"","sk":""}'::JSONB
        -- raise notice 'H';
        --_result := '[{"res":"H"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                        FROM base_${baseVersion}.one u
                        where lower(u.pk) = lower(chelate ->> 'pk')
                              and u.sk = chelate ->> 'sk';

      elsif sk and tk and owner and mbr and strpos(chelate ->> 'tk', '*') > 0 then
        -- 	format('{"sk":"","tk":"*","owner":"", "mbr": %s}',mbr)::JSONB
        -- raise notice 'I';
        -- _result := '[{"res":"I"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.sk = chelate ->> 'sk'
                            and u.owner = owner_key.id
                            and u.form->>'lon' <= (chelate->>'mbr')::JSONB->>'east'
                            and u.form->>'lon' >= (chelate->>'mbr')::JSONB->>'west'
                            and u.form->>'lat' <= (chelate->>'mbr')::JSONB->>'north'
                            and u.form->>'lat' >= (chelate->>'mbr')::JSONB->>'south'
                      ;


      elsif sk and tk and owner and mbr then
        -- 	format('{"sk":"","tk":"","owner":"", "mbr": %s}',mbr)::JSONB
        -- raise notice 'J';
        --_result := '[{"res":"J"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.sk = chelate ->> 'sk'
                            and u.tk = chelate ->> 'tk'
                            and u.owner = owner_key.id
                            and u.form->>'lon' <= (chelate->>'mbr')::JSONB->>'east'
                            and u.form->>'lon' >= (chelate->>'mbr')::JSONB->>'west'
                            and u.form->>'lat' <= (chelate->>'mbr')::JSONB->>'north'
                            and u.form->>'lat' >= (chelate->>'mbr')::JSONB->>'south'
                      ;

      elsif sk and tk and mbr and strpos(chelate ->> 'tk', '*') > 0 then
        -- get all sk in a mbr
        -- 	format('{"sk":"const#<uppercase>","tk":"*", "mbr": %s}',mbr)::JSONB

        -- raise notice 'K';

            SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.sk = chelate ->> 'sk'

                            and u.form->>'lon' <= (chelate->>'mbr')::JSONB->>'east'
                            and u.form->>'lon' >= (chelate->>'mbr')::JSONB->>'west'
                            and u.form->>'lat' <= (chelate->>'mbr')::JSONB->>'north'
                            and u.form->>'lat' >= (chelate->>'mbr')::JSONB->>'south'
                      ;

      elsif sk and tk and mbr then
        -- 	format('{"sk":"","tk":"", "mbr": %s}',mbr)::JSONB
        -- raise notice 'L';
        --_result := '[{"res":"L"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.sk = chelate ->> 'sk'
                            and u.tk = chelate ->> 'tk'
                            and u.form->>'lon' <= (chelate->>'mbr')::JSONB->>'east'
                            and u.form->>'lon' >= (chelate->>'mbr')::JSONB->>'west'
                            and u.form->>'lat' <= (chelate->>'mbr')::JSONB->>'north'
                            and u.form->>'lat' >= (chelate->>'mbr')::JSONB->>'south'
                      ;

      elsif sk and tk and owner and strpos(chelate ->> 'tk', '*') > 0 then
        -- 	'{"sk":"","tk":"*", "owner":""}'::JSONB
        -- raise notice 'M';
        --_result := '[{"res":"M"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.sk = chelate ->> 'sk'

                            and u.owner = owner_key.id
                      ;

      elsif sk and tk and owner then
        -- 	'{"sk":"","tk":"", "owner":""}'::JSONB
        -- raise notice 'N';
        -- _result := '[{"res":"N"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.sk = chelate ->> 'sk'
                            and u.tk = chelate ->> 'tk'
                            and u.owner = owner_key.id
                      ;
      elsif sk and tk and strpos(chelate ->> 'tk', '*') > 0 then
          -- 	'{"sk":"","tk":"*"}'::JSONB
        -- raise notice 'O';
        --_result := '[{"res":"O"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.sk = chelate ->> 'sk'

                      ;

      elsif sk and tk then
        -- raise notice 'P';
        --_result := '[{"res":"P"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.sk = chelate ->> 'sk'
                            and u.tk = chelate ->> 'tk'
                      ;

      elsif xk and yk and owner and mbr and strpos(chelate ->> 'yk', '*') > 0 then
          -- format('{"xk":"","yk":"*", "owner":"", "mbr": %s}',mbr)::JSONB
          -- format('{"xk":"3","yk":"*", "owner":"goose", "mbr": %s}',mbr)::JSONB)
        -- raise notice 'Q';
        --_result := '[{"res":"Q"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.tk = chelate ->> 'xk'
                            and u.owner = owner_key.id
                            and u.form->>'lon' <= (chelate->>'mbr')::JSONB->>'east'
                            and u.form->>'lon' >= (chelate->>'mbr')::JSONB->>'west'
                            and u.form->>'lat' <= (chelate->>'mbr')::JSONB->>'north'
                            and u.form->>'lat' >= (chelate->>'mbr')::JSONB->>'south'
                      ;

      elsif xk and yk and owner and mbr then
        -- format('{"xk":"1","yk":"const#ADOPTEE", "owner":"duckduckgoose", "mbr": %s}',mbr)::JSONB
        -- raise notice 'R';
        --_result := '[{"res":"R"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.tk = chelate ->> 'xk'
                            and u.sk = chelate ->> 'yk'
                            and u.owner = owner_key.id
                            and u.form->>'lon' <= (chelate->>'mbr')::JSONB->>'east'
                            and u.form->>'lon' >= (chelate->>'mbr')::JSONB->>'west'
                            and u.form->>'lat' <= (chelate->>'mbr')::JSONB->>'north'
                            and u.form->>'lat' >= (chelate->>'mbr')::JSONB->>'south'
                      ;

      elsif xk and yk and mbr and strpos(chelate ->> 'yk', '*') > 0 then
        -- format('{"xk":"1","yk":"*", "mbr": %s}',mbr)::JSONB
        -- raise notice 'S';
        -- _result := '[{"res":"S"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.tk = chelate ->> 'xk'

                            and u.form->>'lon' <= (chelate->>'mbr')::JSONB->>'east'
                            and u.form->>'lon' >= (chelate->>'mbr')::JSONB->>'west'
                            and u.form->>'lat' <= (chelate->>'mbr')::JSONB->>'north'
                            and u.form->>'lat' >= (chelate->>'mbr')::JSONB->>'south'
                      ;


      elsif xk and yk and mbr then
        -- format('{"xk":"1","yk":"const#ADOPTEE", "mbr": %s}',mbr)::JSONB
        -- raise notice 'T';
        --_result := '[{"res":"T"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.tk = chelate ->> 'xk'
                            and u.sk = chelate ->> 'yk'
                            and u.form->>'lon' <= (chelate->>'mbr')::JSONB->>'east'
                            and u.form->>'lon' >= (chelate->>'mbr')::JSONB->>'west'
                            and u.form->>'lat' <= (chelate->>'mbr')::JSONB->>'north'
                            and u.form->>'lat' >= (chelate->>'mbr')::JSONB->>'south'
                      ;

      elsif xk and yk and owner and strpos(chelate ->> 'yk', '*') > 0 then
        -- '{"xk":"1","yk":"*", "owner": "duckduckgoose"}'::JSONB
        -- raise notice 'U';
        --_result := '[{"res":"U"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.tk = chelate ->> 'xk'

                            and u.owner = owner_key.id
                      ;

      elsif xk and yk and owner then
        -- '{"xk":"1","yk":"const#ADOPTEE", "owner": "duckduckgoose"}'::JSONB
        -- raise notice 'V';
        --_result := '[{"res":"V"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.tk = chelate ->> 'xk'
                            and u.sk = chelate ->> 'yk'
                            and u.owner = owner_key.id
                      ;

      elsif xk and yk and strpos(chelate ->> 'yk', '*') > 0 then
        -- '{"xk":"1","yk":"*"}'::JSONB
        -- raise notice 'W';
        --_result := '[{"res":"W"}]';
        SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.tk = chelate ->> 'xk'

                      ;

      elsif xk and yk then
        -- '{"xk":"1","yk":"const#ADOPTEE"}'::JSONB
            -- raise notice 'X';
            --_result := '[{"res":"X"}]';
            SELECT array_to_json(array_agg(to_jsonb(u) #- '{form,password}' )) into _result
                      FROM base_${baseVersion}.one u
                      where u.tk = chelate ->> 'xk'
                            and u.sk = chelate ->> 'yk'
                      ;
        else

          -- [Fail 400 when unexpecte Search Pattern]
          return format('{"status:"400","msg":"Bad Request", "extra":"B%s", "chelate": %s}', sqlstate, chelate)::JSONB;

        end if;

      EXCEPTION

          when others then

            --Raise Notice 'query EXCEPTION out';
            return format('{"status":"400","msg":"Bad Request", "extra":"C %s","chelate": %s}',sqlstate, chelate)::JSONB;

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
