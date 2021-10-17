'use strict';

const Step = require('../../lib/runner/step');
module.exports = class DropFunction extends Step {
  constructor(baseName, baseVersion) {
    super(baseName, baseVersion);
    
    // [Function drops occur when a function's name or parameters change]
    
    this.sql = `
    DROP FUNCTION if exists api_0_0_1.adopter(TEXT,JSON); 
    `;
  }    
  
  getName() {
    return 'Drop Functions that have changed.';
  }
  
};