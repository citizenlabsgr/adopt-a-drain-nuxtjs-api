'use strict';
// [issue: need to put a!Aaaaa password in test ]
const Template = require('./template.js');

module.exports = class GetTemplate extends Template {
    constructor(token_name, claim, api_settings, chelate) {
        super(token_name, claim, api_settings,chelate);
        
    }
   /*
    validate() {
      super.validate();
            // TMBR
      // TIO
      // TFO
      // TOO
      
      if (this.hasType('TOKEN') && this.hasType('IDENTITY')  && this.hasType('OWNER_ID')) {
        //
      } else if (this.hasType('TOKEN') && this.hasType('JSON') && this.hasType('OWNER_ID')) {
        //
      }  else if (this.hasType('TOKEN') && this.hasType('OWNER_ID') && this.hasType('OWNER_ID')) {
        //
      } else if (this.hasType('TOKEN') && this.hasType('IDENTITY')) {
        //
      } else if (this.hasType('TOKEN') && this.hasType('JSON')) {
        //
      }  else if (this.hasType('TOKEN') && this.hasType('OWNER_ID')) {
        //
      } else if (this.hasType('TOKEN') && this.hasType('MBR')) {
        // 
      }  else {
        throw new Error(`Invalid parameter combination for ${this.api_settings.name.name} expect TMBR, TIO, TJO, TOO, TI, TJ, TO `);
      }
      
    }
    */

    
    get200() {
      // note: id and form are 
      return `
          SELECT is (
  
            (${this.kind}_${this.version}.${this.function_name}(
              ${this.token}
              ${this.ownerId}
              ${this.id}
              ${this.form}
              ${this.mbr}
              
            )::JSONB - 'selection'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB ${this.function_name}(${this.parameter_types}) ${this.method} ${this.claim.scope} 200 0_0_1'::TEXT
          );
        `; 
    }

    templatize() {
        let rc = this.get200();
        return rc;
    }
};