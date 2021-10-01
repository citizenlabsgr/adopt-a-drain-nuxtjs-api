'use strict';

const Comment = require('../../lib/runner/comment.js'); 
const Extension = require('../db/extension.js');
const FunctionSigninTest = require('./function_signin_test.js'); 
const FunctionSignupTest = require('./function_signup_test.js'); 
const FunctionAdopteesTest = require('./function_adoptees_test.js'); 
const FunctionAdopterPutTest = require('./function_adopter_put_test.js'); 

module.exports = class ApiTests extends Array {
  constructor(apiVersion, baseVersion) {
    /* $lab:coverage:off$ */
    super();
    this.push(new Comment('-- Enable Api Testing'));
    this.push(new Extension('pgtap','public'));
    this.push(new FunctionSignupTest('api', apiVersion, baseVersion));
    this.push(new FunctionSigninTest('api', apiVersion, baseVersion));
    this.push(new FunctionAdopteesTest('api', apiVersion, baseVersion));
    this.push(new FunctionAdopterPutTest('api', apiVersion, baseVersion));

    /* $lab:coverage:on$ */
  }    
};