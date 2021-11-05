'use strict';
// [issue: need to put a!Aaaaa password in test ]
const Template = require('./template.js');

module.exports = class GetTemplate extends Template {
    constructor(token_name, claim, api_settings, chelate) {
        super(token_name, claim, api_settings,chelate);
        
    }
    validate() {
      super.validate();
      /*
      [TOKEN], [IDENTITY["<v>"||"*"]], [OWNER_ID]
if ID  = * select where owner = OD  
if ID != * select where id = ID and owner = OD

      VARCHAR || 

      IDENTITY === OWNER_ID 
*/

      if (!this.hasType('IDENTITY') && !this.hasType('OWNER_ID') && !this.hasType('JSON')) {
        throw new Error(`IDENTITY, OWNER_ID or JSON parameter required in ${this.api_settings.name.name} `);
      }
      if (this.hasType('IDENTITY') && this.hasType('OWNER_ID') && this.hasType('JSON') ) {
        throw new Error(`Either IDENTITY, OWNER_ID or JSON parameter required in ${this.api_settings.name.name} `);
      }
      // if (this.hasType('IDENTITY') && this.hasType('OWNER_ID') ) {
      //  throw new Error(`Either IDENTITY or OWNER_ID parameter required in ${this.api_settings.name.name} `);
      // }
      // if (this.hasType('IDENTITY') && this.hasType('JSON') ) {
      //  throw new Error(`Either IDENTITY or JSON parameter required in ${this.api_settings.name.name} `);
      // }
      if (this.hasType('OWNER_ID') && this.hasType('JSON') ) {
        throw new Error(`Either OWNER_ID or JSON parameter required in ${this.api_settings.name.name} `);
      }
      if (this.hasType('VARCHAR')) {
        throw new Error(`VARCHAR parameter not permitted in ${this.api_settings.name.name} `);
      }
      if (this.hasType('MBR')) {
        throw new Error(`MBR parameter not permitted in ${this.api_settings.name.name} `);
      }
      // if (this.hasType('OWNER_ID')) {
      //  throw new Error(`OWNER_ID parameter not permitted in ${this.api_settings.name.name} `);
      // }
    }
    get200() {
      // note: id and form are 
      return `
          SELECT is (
  
            (${this.kind}_${this.version}.${this.function_name}(
              ${this.token}
              ${this.id}
              ${this.form}
              ${this.ownerId}
            )::JSONB - 'selection'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB ${this.function_name} ${this.method} 200 0_0_1'::TEXT
          );
        `; 
    }
    templatize() {
        let rc = this.get200();
        return rc;
    }
};