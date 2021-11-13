'use strict';

const Step = require('../../lib/runner/step');
module.exports = class TypeMbr extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    
    // [MBR Type] 
    this.name = 'mbr';
    this.format = '(<north>,<south>,<west>,<east>)';
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
                    AND t.typname='${this.name}') then 
        CREATE TYPE ${this.name} AS (
          north numeric(14,10),
          south numeric(14,10),
          west numeric(15,10),
          east numeric(15,10)
        );  
      end if;
    
    END;
 $BODY$;  
    `;
  }    
  
  getName() {
    return `.${this.name} .${this.format} `;
  }
  
};