'use strict';
const Comment = require('../../lib/runner/comment.js');

const Extension = require('../db/extension.js');
const TableTest = require('./table_test.js');

const FunctionChangedKeyTest = require('./function_changed_key_test.js'); 
const FunctionChelateTest = require('./function_chelate_test.js'); 
const FunctionDeleteTest = require('./function_delete_test.js'); 
const FunctionGetJwtClaimsTest = require('./function_get_jwt_claims_test.js'); 
/* $lab:coverage:off$ */
const FunctionGetJwtSecretTest = require('./function_get_jwt_secret_test.js'); 
const FunctionInsertTest = require('./function_insert_test.js'); 
// const FunctionQueryTest = require('./function_query_test.js'); 
const FunctionUpdateTest = require('./function_update_test.js');
/* $lab:coverage:on$ */
const FunctionValidateChelateTest = require('./function_validate_chelate_test.js'); 
const FunctionValidateCredentialsTest = require('./function_validate_credentials_test.js'); 
const FunctionValidateFormTest = require('./function_validate_form_test.js'); 
const FunctionValidateTokenTest = require('./function_validate_token_test.js'); 
const FunctionQueryTest = require('./function_query_test.js'); 

module.exports = class BaseTests extends Array {
  constructor(baseVersion) {
    /* $lab:coverage:off$ */
    super();
    this.push(new Comment('-- Enable Base Testing'));
    this.push(new Extension('pgtap','public'));
    
    this.push(new TableTest('base', baseVersion));

    this.push(new FunctionChangedKeyTest('base', baseVersion));
    this.push(new FunctionChelateTest('base', baseVersion));
    this.push(new FunctionDeleteTest('base', baseVersion));
    this.push(new FunctionGetJwtClaimsTest('base', baseVersion));
    this.push(new FunctionGetJwtSecretTest('base', baseVersion));
    this.push(new FunctionInsertTest('base', baseVersion));
    this.push(new FunctionQueryTest('base', baseVersion));

    this.push(new FunctionUpdateTest('base', baseVersion));
    this.push(new FunctionValidateChelateTest('base', baseVersion));
    this.push(new FunctionValidateCredentialsTest('base', baseVersion));
    this.push(new FunctionValidateFormTest('base', baseVersion));
    this.push(new FunctionValidateTokenTest('base', baseVersion));


    /* $lab:coverage:on$ */

  }    
};