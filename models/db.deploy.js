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

const DropFunctions = require('./db/drop_functions.js');


const FunctionAlgorithmSign001 = require('./db/function_algorithm_sign_001.js');
const FunctionChangedKey = require('./db/function_changed_key_002.js');
const FunctionChelate = require('./db/function_chelate_002.js');
const FunctionDelete001 = require('./db/function_delete_001.js');
const FunctionGetJwtClaims001 = require('./db/function_get_jwt_claims_001.js');
const FunctionGetJwtSecret001 = require('./db/function_get_jwt_secret_001.js');
const FunctionInsert001 = require('./db/function_insert_001.js');

const FunctionQuery = require('./db/function_query_004.js');

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

const FunctionSignin = require('./db/function_signin_003.js');

const FunctionSignup = require('./db/function_signup_003.js');

const FunctionAdoptees = require('./db/function_adoptees_002.js');

const FunctionAdopterPost = require('./db/function_adopter_post_003.js');
const FunctionAdopterGet = require('./db/function_adopter_get_002.js');
const FunctionAdopterPut = require('./db/function_adopter_put_002.js');
const FunctionAdopterDelete = require('./db/function_adopter_delete_001.js');

// const TestTable = require('./db/table_test_001.js');
// const BaseTests = require('./tests/test_base.js');
// const ApiTests = require('./tests/test_api.js');
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
  throw new Error('Improper Environment, NODE_ENV is not set! (.env or gh secrets)');
}
if (!process.env.JWT_SECRET) {
  // console.log('process.env', process.env);
  // [* Stop when NODE_ENV is not available.]
  throw new Error('Improper Environment, JWT_SECRET is not set! (.env or gh secrets)');
}
if (!process.env.DATABASE_URL) {
  // [* Stop when DATABASE_URL is not available.]
  throw new Error('Improper Environment, DATABASE_URL is not set! (.env or gh secrets)');
}

if (!process.env.ACCEPTED_ORIGINS) {
  // [* Stop when DATABASE_URL is not available.]
  throw new Error('Improper Environment, ACCEPTED_ORIGINS is not set! (.env or gh secrets)');
}

if (!process.env.HEROKU_API_KEY) {
  // [* Stop when DATABASE_URL is not available.]
  throw new Error('Improper Environment, HEROKU_API_KEY is not set! (.env or gh secrets)');
}

// [* Switch to heroku color url when available]
const databaseUrl = new DatabaseUrl(process);
const DB_URL = databaseUrl.db_url; 
// const testable = databaseUrl.testable;
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
       .add(new Comment('Load Extensions '))
       .add(new Extension('pgcrypto','public'))
       .add(new Extension('"uuid-ossp"','public'))
       .add(new Comment('Schema '))
       .add(new Schema('base', baseVersion))
       .add(new Schema('api', apiVersion))
       .add(new Comment('Base Schema Table '))
       .add(new Table001('base',baseVersion))
       .add(new Comment('Base Schema Functions '))
       .add(new DropFunctions('',''))
       .add(new FunctionUrlDecode001('base', baseVersion))
       .add(new FunctionUrlEncode001('base', baseVersion))
       .add(new FunctionAlgorithmSign001('base', baseVersion))
       .add(new FunctionChangedKey('base', baseVersion))
       .add(new FunctionChelate('base', baseVersion))
       .add(new FunctionDelete001('base', baseVersion))
       .add(new FunctionGetJwtClaims001('base', baseVersion))
       .add(new FunctionGetJwtSecret001('base', baseVersion, process))
       .add(new FunctionInsert001('base', baseVersion))

       .add(new FunctionQuery('base', baseVersion))
       .add(new FunctionSign001('base', baseVersion))
       .add(new FunctionUpdate001('base', baseVersion))
     
       .add(new FunctionValidateChelate001('base', baseVersion))
       .add(new FunctionValidateCredentials001('base', baseVersion))
       .add(new FunctionValidateCriteria001('base', baseVersion))
       .add(new FunctionValidateForm001('base', baseVersion))
       .add(new FunctionValidateToken001('base', baseVersion))
       .add(new FunctionVerify001('base', baseVersion))
       
       .add(new Comment('Api Schema Functions '))
       .add(new FunctionTime001('api', apiVersion))

       .add(new FunctionSignup('api', apiVersion))
       .add(new FunctionSignin('api', apiVersion))

       .add(new FunctionAdoptees('api', apiVersion, baseVersion))
       .add(new FunctionAdopterPost('api', apiVersion, baseVersion))
       .add(new FunctionAdopterPut('api', apiVersion, baseVersion))
       .add(new FunctionAdopterDelete('api', apiVersion, baseVersion))
       .add(new FunctionAdopterGet('api', apiVersion, baseVersion))
       ;
       
       
// [* Tests]

// if (process.env.NODE_ENV === 'development') {
//  runner
//  .load(new BaseTests(baseVersion))
//  .load(new ApiTests(apiVersion, baseVersion));
// }

runner.run().catch((err) => {
  console.log('db.deploy', err);
});



