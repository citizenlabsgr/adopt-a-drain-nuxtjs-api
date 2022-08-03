'use strict';
// const pg = require('pg');
const Step = require('../../../../lib/runner/step');
module.exports = class CreateFunctionGetJwtSecret001 extends Step {
  constructor(baseName, baseVersion, process) {
    super(baseName, baseVersion);
    // this.kind = kind;
    this.name = 'get_jwt_secret';
    this.name = `${this.kind}_${this.version}.${this.name}`;
    this.environment = process.env.NODE_ENV;
    this.sql = `CREATE OR REPLACE FUNCTION ${this.name}() RETURNS TEXT
    AS $$
    declare rc TEXT;
    declare env TEXT := '${this.environment}';
    BEGIN
        -- [* use app.settings.jwt_secret when available]
        -- [* use JWT_SECRET as default]
        rc := COALESCE(
           current_setting('app.settings.jwt_secret', true), 
           '${process.env.JWT_SECRET}'
           )::TEXT;

        RETURN rc;
    END;  $$ LANGUAGE plpgsql;
    `;
    // console.log('CreateFunctionGetJwtSecret', this.sql);
  }    
};
