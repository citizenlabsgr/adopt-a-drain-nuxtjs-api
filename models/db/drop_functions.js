'use strict';

const Step = require('../../lib/runner/step');
module.exports = class DropFunction extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    
    // [Function drops occur when a function's name or parameters change]
    
    this.sql = `
    DROP FUNCTION if exists api_0_0_1.signup(TEXT,JSON,TEXT); 
    DROP FUNCTION if exists api_0_0_1.signin(TEXT,JSON); 
    DROP FUNCTION if exists api_0_0_1.adopter(TEXT,JSON); 

    DROP FUNCTION if exists base_0_0_1.chelate(JSONB); 
    DROP FUNCTION if exists base_0_0_1.chelate(JSONB,JSONB); 
    DROP FUNCTION if exists base_0_0_1.insert(JSONB,TEXT); 
    `;
  }    
  
  getName() {
    return 'Drop Functions that have changed.';
  }
  
};