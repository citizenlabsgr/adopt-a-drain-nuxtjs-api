'use strict';
// [issue: need to put a!Aaaaa password in test ]
const Template = require('./template.js');

module.exports = class GetTemplateMultiPart extends Template {
    constructor(token_name, claim, api_settings, chelate) {
        super(token_name, claim, api_settings,chelate);
    }

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
