'use strict';

const Step = require('../../lib/runner/step');
module.exports = class TypeIdentity extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    
    // [OWNER_ID Type]
    
    this.sql = `
    DO
    $BODY$  
    BEGIN
      if not exists(SELECT      n.nspname as schema, t.typname as type 
                    FROM        pg_type t 
                    LEFT JOIN   pg_catalog.pg_namespace n ON n.oid = t.typnamespace 
                    WHERE       (t.typrelid = 0 OR (SELECT c.relkind = 'c' FROM pg_catalog.pg_class c WHERE c.oid = t.typrelid)) 
                    AND     NOT EXISTS(SELECT 1 FROM pg_catalog.pg_type el WHERE el.oid = t.typelem AND el.typarray = t.oid)
                    AND     n.nspname NOT IN ('pg_catalog', 'information_schema')
                    AND t.typname='identity') then 
        CREATE TYPE identity AS (
          id TEXT
        );  
      end if;
    
    END;
 $BODY$;  
    `;
  }    
  
  getName() {
    return 'create token type.';
  }
  
};