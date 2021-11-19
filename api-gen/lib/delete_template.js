'use strict';

const Template = require('./template.js');
// const Settings = require('./settings.js');
module.exports = class DeleteTemplate extends Template {
    constructor(token_name, claim, api_settings, chelate) {
        super(token_name, claim, api_settings, chelate);        
    }
    validate() {
      super.validate();
      if (!this.hasType('OWNER_ID')) {
        throw new Error(`OWNER_ID parameter required in ${this.api_settings.name.name} `);
      }
      // if (!this.hasType('OWNER_ID')) {
      //   throw new Error(`OWNER_ID parameter required in ${this.api_settings.name.name} `);
      // }

      if (this.hasType('JSON')) {
        throw new Error(`JSON parameter not permitted in ${this.api_settings.name.name} `);
      }
      
      if (this.hasType('IDENTITY') && !this.hasType("OWNER_ID")) {
        throw new Error(`IDENTITY parameter not permitted without OWNER_ID parameter in ${this.api_settings.name.name} `);
      }
      
      if (this.hasType('MBR')) {
        throw new Error(`MBR parameter not permitted in ${this.api_settings.name.name} `);
      }
      
    }
    get200() {
      // console.log('token_name', this.token_name);
      // let settings = new Settings().get();
      return `
          SELECT is (
  
            (${this.kind}_${this.version}.${this.function_name}(
              ${this.token}
              ${this.ownerId}
              ${this.id}
            )::JSONB - '{deletion,criteria}'::TEXT[]),
        
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