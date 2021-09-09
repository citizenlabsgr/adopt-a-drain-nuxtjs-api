'use strict';
/* eslint-disable no-undef */

console.log('db.deploy');
// const process = require('process');
// const Consts = require('../lib/constants/consts');
const SqlRunner = require('../lib/runner/runner_sql.js');
const Comment = require('../lib/runner/comment.js');
const Extension = require('./db/extension.js');
const Schema = require('./db/schema.js');

const Table001 = require('./db/table_001.js');

const FunctionAlgorithmSign001 = require('./db/function_algorithm_sign_001.js');
const FunctionChangedKey001 = require('./db/function_changed_key_001.js');
const FunctionChelate001 = require('./db/function_chelate_001.js');
const FunctionDelete001 = require('./db/function_delete_001.js');
const FunctionGetJwtClaims001 = require('./db/function_get_jwt_claims_001.js');
const FunctionGetJwtSecret001 = require('./db/function_get_jwt_secret_001.js');
const FunctionInsert001 = require('./db/function_insert_001.js');
// const FunctionQuery001 = require('./db/function_query_001.js');
// const FunctionQuery001 = require('./db/function_query_001.js');
// const FunctionQuery002 = require('./db/function_query_002.js');
const FunctionQuery003 = require('./db/function_query_003.js');

const FunctionSign001 = require('./db/function_sign_001.js');
const FunctionUpdate001 = require('./db/function_update_001.js');
const FunctionUrlDecode001 = require('./db/function_url_decode_001.js');
const FunctionUrlEncode001 = require('./db/function_url_encode_001.js');
const FunctionValidateChelate001 = require('./db/function_validate_chelate_001.js');
const FunctionValidateCredentials001 = require('./db/function_validate_credentials_001.js');
const FunctionValidateCriteria001 = require('./db/function_validate_criteria_001.js');
const FunctionValidateForm001 = require('./db/function_validate_form_001.js');
const FunctionValidateToken001 = require('./db/function_validate_token_001.js');
const FunctionVerify001 = require('./db/function_verify_001.js');
const FunctionTime001 = require('./db/function_time_001.js');
const FunctionSignin001 = require('./db/function_signin_001.js');
const FunctionSignup001 = require('./db/function_signup_001.js');
const FunctionAdoptees002 = require('./db/function_adoptees_002.js');

// const TestTable = require('./db/table_test_001.js');
const BaseTests = require('./tests/test_base.js');
const ApiTests = require('./tests/test_api.js');
const DatabaseUrl = require('../lib/plugins/postgres/database_url.js');

// run all scripts
// s have an order
// Add new or alters to end
// Make new class for alters
// [* set the verson ]

const baseVersion='0_0_1';
const apiVersion='0_0_1';
if (!process.env.NODE_ENV) {
  // [* Stop when NODE_ENV is not available.]
  throw new Error('Improper Environment, NODE_ENV is not set!');
}

if (!process.env.JWT_SECRET) {
  // console.log('process.env', process.env);
  // [* Stop when NODE_ENV is not available.]
  throw new Error('Improper Environment, JWT_SECRET is not set!');
}
if (!process.env.DATABASE_URL) {
  // [* Stop when DATABASE_URL is not available.]
  throw new Error('Improper Environment, DATABASE_URL is not set!');
}
// [* Switch to heroku color url when available]
const databaseUrl = new DatabaseUrl(process);
const DB_URL = databaseUrl.db_url; 
const testable = databaseUrl.testable;
/*
if (process.env.DATABASE_URL === DB_URL) {
  // [* No testing in Heroku staging]
  // [* No testing in Heroku production]
  // [* No testing in Heroku review]
  // [* Test in local development]
  if (process.env.NODE_ENV === 'developmemt') {
    testable = true;
    console.log('Development Database Connection');
  } else {
    console.log('Production Database Connection');
  }
} else {
  console.log("Branch", process.env.HEROKU_BRANCH);
  if (process.env.HEROKU_BRANCH) {
    console.log('Review Database Connection');
  } else {
    // staging db
    console.log('Staging Database Connection');
  }
}
*/
// console.log('process.env.NODE_ENV ',process.env.NODE_ENV );
// console.log('DATABASE_URL', process.env.DATABASE_URL);
// console.log('DB_URL', DB_URL);
// console.log('testable', testable);

// [* Build database]
// [* support multiple versions]
const runner = new SqlRunner(DB_URL)
       .add(new Comment('-- Load Extensions --'))
       .add(new Extension('pgcrypto','public'))
       .add(new Extension('"uuid-ossp"','public'))
       .add(new Comment('--  Schema --'))
       .add(new Schema('base', baseVersion))
       .add(new Schema('api', apiVersion))
       .add(new Comment('--  Base Schema Table --'))
       .add(new Table001('base',baseVersion))
       .add(new Comment('--  Base Schema Functions --'))
       .add(new FunctionUrlDecode001('base', baseVersion))
       .add(new FunctionUrlEncode001('base', baseVersion))
       .add(new FunctionAlgorithmSign001('base', baseVersion))
       .add(new FunctionChangedKey001('base', baseVersion))
       .add(new FunctionChelate001('base', baseVersion))
       .add(new FunctionDelete001('base', baseVersion))
       .add(new FunctionGetJwtClaims001('base', baseVersion))
       .add(new FunctionGetJwtSecret001('base', baseVersion, process))
       .add(new FunctionInsert001('base', baseVersion))
       // .add(new FunctionQuery001('base', baseVersion))
       // .add(new FunctionQuery001('base', baseVersion))
       // .add(new FunctionQuery002('base', baseVersion))
       .add(new FunctionQuery003('base', baseVersion))
       .add(new FunctionSign001('base', baseVersion))
       .add(new FunctionUpdate001('base', baseVersion))
     
       .add(new FunctionValidateChelate001('base', baseVersion))
       .add(new FunctionValidateCredentials001('base', baseVersion))
       .add(new FunctionValidateCriteria001('base', baseVersion))
       .add(new FunctionValidateForm001('base', baseVersion))
       .add(new FunctionValidateToken001('base', baseVersion))
       .add(new FunctionVerify001('base', baseVersion))
       .add(new Comment('--  Api Schema Functions --'))
       .add(new FunctionTime001('api', apiVersion))
       .add(new FunctionSignup001('api', apiVersion))
       .add(new FunctionSignin001('api', apiVersion))
       .add(new FunctionAdoptees002('api', apiVersion, baseVersion))
       ;
       
// [* Tests]
if (testable) {

    runner
      .load(new BaseTests(baseVersion))
      .load(new ApiTests(apiVersion, baseVersion));

}

runner.run();



