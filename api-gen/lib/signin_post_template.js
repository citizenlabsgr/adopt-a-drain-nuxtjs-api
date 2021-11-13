'use strict';

const Template = require('./template.js');

module.exports = class SigninPostTemplate extends Template {
    constructor(token_name, claim, api_settings, chelate) {
        super(token_name, claim, api_settings, chelate);
        // console.log('PostTemplate data', data);
        // this.token_name = token_name;
        
    }
    validate() {
      super.validate();
      if (!this.hasType('JSONB')) {
        throw new Error(`JSONB parameter required in ${this.api_settings.name.name} `);
      }
      /*
      if (this.hasType('IDENTITY')) {
        throw new Error(`IDENTITY parameter not permitted in ${this.api_settings.name.name} `);
      }
      
      if (this.hasType('MBR')) {
        throw new Error(`MBR parameter not permitted in ${this.api_settings.name.name} `);
      }
      */
    }
    get200() {
        return `
        SELECT is (
            (api_${this.version}.${this.function_name}(
              ${this.token}
              ${this.form}
              
            )::JSONB - 'token'),
        
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