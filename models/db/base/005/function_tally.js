'use strict';
// const pg = require('pg');
const Step = require('../../../../lib/runner/step');
module.exports = class CreateFunctionTally001 extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'tally';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.params = 'skey SECONDARYKEY';
    this.sql = `CREATE OR REPLACE FUNCTION  ${this.name}(${this.params})
     returns INT
     as
     $$
     declare key_count int;
     begin
       if strpos(skey.tk, '*') > 0 then
         select count(*) 
          into key_count
          from base_0_0_1.one
          where sk=skey.sk;
       else
           select count(*) 
          into key_count
          from base_0_0_1.one
          where sk=skey.sk and tk=skey.tk;    
       end if;   
        
       return key_count::TEXT;
     end;
     $$ LANGUAGE plpgsql;
    `;
    // console.log('CreateFunction', this.sql);
  }
  getName() {
    return `${this.name}(${this.params}) `;
  }
};