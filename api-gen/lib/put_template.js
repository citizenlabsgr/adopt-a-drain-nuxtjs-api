'use strict';

const Template = require('./template.js');

module.exports = class PuttTemplate extends Template {
    constructor(token_name, claim, api_settings, chelate) {
        super(token_name, claim, api_settings, chelate);
        // console.log('PostTemplate data', data);
        // this.token_name = token_name;
        
    }
    validate() {
      super.validate();
      if (!this.hasType('JSON')) {
        throw new Error(`JSON parameter required in ${this.api_settings.name.name} `);
      }
      
      if (!this.hasType('IDENTITY')) {
        throw new Error(`IDENTITY parameter required in ${this.api_settings.name.name} `);
      }
 
      
    }
    get200() {
        return `
        SELECT is (
            (api_${this.version}.${this.function_name}(
              ${this.token}
              ${this.id}
              ${this.form}
              ${this.ownerId}
            )::JSONB - 'updation'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB ${this.function_name} ${this.method} 200 0_0_1'::TEXT
        
          );
        `;
    }
    templatize() {
      let rc = this.get200();
      return rc;
    }
    /*
templatize() {
        return `
        SELECT is (
            (api_${this.version}.${this.function_name}(
              ${this.token_name},
              '${this.form}'::JSON
              ${this.ownerId}
            )::JSONB - 'insertion'),
        
            '{"msg":"OK","status":"200"}'::JSONB,
        
            'DB ${this.function_name} ${this.method} 200 0_0_1'::TEXT
        
          );
        `;
    }
    */
};