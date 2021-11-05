'use strict';
// const pg = require('pg');
const Step = require('../../../../lib/runner/step');
module.exports = class CreateFunctionSign extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'sign';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.params = "payload json, secret text, algorithm text DEFAULT 'HS256'";
    this.return = 'TOKEN';
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}(${this.params})
    RETURNS ${this.return} LANGUAGE sql AS $$
    WITH
      header AS (
        SELECT ${this.kind}_${this.version}.url_encode(convert_to('{"alg":"' || algorithm || '","typ":"JWT"}', 'utf8')) AS data
        ),
      payload AS (
        SELECT ${this.kind}_${this.version}.url_encode(convert_to(payload::text, 'utf8')) AS data
        ),
      signables AS (
        SELECT header.data || '.' || payload.data AS data FROM header, payload
        )
    SELECT
        signables.data || '.' ||
        ${this.kind}_${this.version}.algorithm_sign(signables.data, secret, algorithm) FROM signables;
    $$;
    `;
    // console.log('CreateFunction', this.sql);
  }    
  getName() {
    return `${this.name}(${this.params}) ${this.return}`;
  }
};