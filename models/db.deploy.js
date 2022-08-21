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

const TypeOwnerId = require('./db/type_owner_id_001.js');
const TypeIdentity = require('./db/type_identity_001.js');
const TypeToken = require('./db/type_token_001.js');
const TypeMbr = require('./db/type_mbr_001.js');
const TypePrimaryKey = require('./db/type_primarykey_001.js');
const TypeSecondaryKey = require('./db/type_secondarykey_001.js');

let base_version = '005';
const FunctionAlgorithmSign = require(`./db/base/${base_version}/function_algorithm_sign.js`);
const FunctionChangedKey = require(`./db/base/${base_version}/function_changed_key.js`);
const FunctionChelate = require(`./db/base/${base_version}/function_chelate.js`);
const FunctionDelete = require(`./db/base/${base_version}/function_delete.js`);
const FunctionGetJwtClaims = require(`./db/base/${base_version}/function_get_jwt_claims.js`);
const FunctionGetJwtSecret = require(`./db/base/${base_version}/function_get_jwt_secret.js`);
const FunctionInsert = require(`./db/base/${base_version}/function_insert.js`);
const FunctionQuery = require(`./db/base/${base_version}/function_query.js`);
const FunctionQueryMbr = require(`./db/base/${base_version}/function_query_mbr.js`);

const FunctionSign = require(`./db/base/${base_version}/function_sign.js`);

const FunctionTally = require(`./db/base/${base_version}/function_tally.js`);

const FunctionUpdate = require(`./db/base/${base_version}/function_update.js`);
const FunctionUpdateJOP = require(`./db/base/${base_version}/function_update_jop.js`);

const FunctionUrlDecode = require(`./db/base/${base_version}/function_url_decode.js`);
const FunctionUrlEncode = require(`./db/base/${base_version}/function_url_encode.js`);
const FunctionValidateChelate = require(`./db/base/${base_version}/function_validate_chelate.js`);
const FunctionValidateCredentials = require(`./db/base/${base_version}/function_validate_credentials.js`);
const FunctionValidateCriteria = require(`./db/base/${base_version}/function_validate_criteria.js`);
const FunctionValidateForm = require(`./db/base/${base_version}/function_validate_form.js`);
const FunctionValidateToken = require(`./db/base/${base_version}/function_validate_token.js`);
const FunctionVerify = require(`./db/base/${base_version}/function_verify.js`);
const FunctionTime = require(`./db/base/${base_version}/function_time.js`);

// signin
let signin_version = '003';
const FunctionSignin = require(`./db/signin/${signin_version}/function_signin_post.js`);

// signup
let signup_version = '003';
const FunctionSignup = require(`./db/signup/${signup_version}/function_signup_post.js`);

// Adoptees
// let adoptees_version = '003';
// const FunctionAdoptees = require(`./db/adoptees/${adoptees_version}/function_adoptees.js`);

// Adopter
let adopter_version = '006';
// const FunctionAdopterDeleteTv = require(`./db/adopter/${adopter_version}/function_adopter_delete_toi.js`);
const FunctionAdopterDeleteToi = require(`./db/adopter/${adopter_version}/function_adopter_delete_toi.js`);
const FunctionAdopterGetToi = require(`./db/adopter/${adopter_version}/function_adopter_get_toi.js`);
// const FunctionAdopterGetTI = require(`./db/adopter/${adopter_version}/function_adopter_get_ti.js`);
const FunctionAdopterPostTj = require(`./db/adopter/${adopter_version}/function_adopter_post_toj.js`);
const FunctionAdopterPutToij = require(`./db/adopter/${adopter_version}/function_adopter_put_toij.js`);

// Adoptee
let adoptee_version = '006';
const FunctionAdopteeDeleteToi = require(`./db/adoptee/${adoptee_version}/function_adoptee_delete_toi.js`);

const FunctionAdopteeGetToi = require(`./db/adoptee/${adoptee_version}/function_adoptee_get_toi.js`);
// const FunctionAdopteeGetTJ = require(`./db/adoptee/${adoptee_version}/function_adoptee_get_tj.js`);
const FunctionAdopteeGetTo = require(`./db/adoptee/${adoptee_version}/function_adoptee_get_to.js`);
const FunctionAdopteeGetTMbr = require(`./db/adoptee/${adoptee_version}/function_adoptee_get_tmbr.js`);
const FunctionAdopteePostToj = require(`./db/adoptee/${adoptee_version}/function_adoptee_post_toj.js`);
const FunctionAdopteePutToij = require(`./db/adoptee/${adoptee_version}/function_adoptee_put_toij.js`);

// Document
let document_version = '002';
const FunctionDocumentDeleteToi = require(`./db/document/${document_version}/function_document_delete_toi.js`);
const FunctionDocumentGetToi = require(`./db/document/${document_version}/function_document_get_toi.js`);
const FunctionDocumentPostToj = require(`./db/document/${document_version}/function_document_post_toj.js`);

// Page
let page_version = '003';
const FunctionPageDeleteTop = require(`./db/page/${page_version}/function_page_delete_top.js`);
const FunctionPageGetTop = require(`./db/page/${page_version}/function_page_get_top.js`);
const FunctionPagePostToj = require(`./db/page/${page_version}/function_page_post_toj.js`);
const FunctionPagePutTopj = require(`./db/page/${page_version}/function_page_put_topj.js`);

// Setup

const DatabaseUrl = require('../lib/plugins/postgres/database_url.js');


// run all scripts
// s have an order
// Add new or alters to end
// Make new class for alters
// [* set the verson ]

const documentFolder = `${__dirname}/documents`;
console.log('documentFolder ',documentFolder);
const SetupRunner = require('../aad_admin/lib/runner.js');
const BreakdownSetup = require('../aad_admin/lib/breakdown_setup.js');

const BreakdownDocs = require('../aad_admin/lib/breakdown_docs.js');
const StoreDocs = require('../aad_admin/lib/store_docs.js');
const Util = require('../aad_admin/lib/util.js');

const fileList = new Util().getFileList(documentFolder);




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

       .add(new Comment('Custom Types '))
       .add(new TypeOwnerId('api', apiVersion))
       .add(new TypeIdentity('api', apiVersion))
       .add(new TypeToken('api', apiVersion))
       .add(new TypeMbr('api', apiVersion))
        .add(new TypePrimaryKey('api', apiVersion))
        .add(new TypeSecondaryKey('api', apiVersion))
        .add(new Comment('Base Schema Table '))
       .add(new Table001('base',baseVersion))
       .add(new Comment('Base Schema Functions '))

       .add(new DropFunctions('',''))
       .add(new FunctionUrlDecode('base', baseVersion))
       .add(new FunctionUrlEncode('base', baseVersion))
       .add(new FunctionAlgorithmSign('base', baseVersion))
       .add(new FunctionChangedKey('base', baseVersion))
       .add(new FunctionChelate('base', baseVersion))
       .add(new FunctionDelete('base', baseVersion))
       .add(new FunctionGetJwtClaims('base', baseVersion))
       .add(new FunctionGetJwtSecret('base', baseVersion, process))
       .add(new FunctionInsert('base', baseVersion))

       .add(new FunctionQuery('base', baseVersion))
       .add(new FunctionQueryMbr('base', baseVersion))

       .add(new FunctionSign('base', baseVersion))
        .add(new FunctionTally('base', baseVersion))

        .add(new FunctionUpdate('base', baseVersion))
        .add(new FunctionUpdateJOP('base', baseVersion))
       .add(new FunctionValidateChelate('base', baseVersion))
       .add(new FunctionValidateCredentials('base', baseVersion))
       .add(new FunctionValidateCriteria('base', baseVersion))
       .add(new FunctionValidateForm('base', baseVersion))
       .add(new FunctionValidateToken('base', baseVersion))
       .add(new FunctionVerify('base', baseVersion))

       .add(new Comment('Api Schema Functions '))
       .add(new FunctionTime('api', apiVersion))

       .add(new FunctionSignup('api', apiVersion))
       .add(new FunctionSignin('api', apiVersion))

       // Adopter
       .add(new FunctionAdopterDeleteToi('api', apiVersion, baseVersion))
       .add(new FunctionAdopterGetToi('api', apiVersion, baseVersion))
       // .add(new FunctionAdopterGetTI('api', apiVersion, baseVersion))
       .add(new FunctionAdopterPostTj('api', apiVersion, baseVersion))
       .add(new FunctionAdopterPutToij('api', apiVersion, baseVersion))

       // .add(new FunctionAdopterPutTIJ('api', apiVersion, baseVersion))

       // Adoptee
       .add(new FunctionAdopteeDeleteToi('api', apiVersion, baseVersion))
       .add(new FunctionAdopteeGetTMbr('api', apiVersion, baseVersion))
       .add(new FunctionAdopteeGetTo('api', apiVersion, baseVersion))
       .add(new FunctionAdopteeGetToi('api', apiVersion, baseVersion))
       // .add(new FunctionAdopteeGetTJ('api', apiVersion, baseVersion))
       .add(new FunctionAdopteePostToj('api', apiVersion, baseVersion))
       .add(new FunctionAdopteePutToij('api', apiVersion, baseVersion))

       // Document
       .add(new FunctionDocumentDeleteToi('api', apiVersion, baseVersion))
       .add(new FunctionDocumentGetToi('api', apiVersion, baseVersion))
       .add(new FunctionDocumentPostToj('api', apiVersion, baseVersion))

       // Page
        .add(new FunctionPageDeleteTop('api', apiVersion,baseVersion))
        .add(new FunctionPageGetTop('api', apiVersion,baseVersion))
        .add(new FunctionPagePostToj('api', apiVersion, baseVersion))
        .add(new FunctionPagePutTopj('api',apiVersion, baseVersion))

       // Data Loads
       // TBD .add(new DataDocumentPost('api', apiVersion, baseVersion))

       ;


// [* Tests]

// if (process.env.NODE_ENV === 'development') {
//  runner
//  .load(new BaseTests(baseVersion))
//  .load(new ApiTests(apiVersion, baseVersion));
// }

const setupRunner =  new SetupRunner(true)
                  .setConnectionString(DB_URL)
                  ;
setupRunner
    .add(new BreakdownSetup({fileList: fileList, documentFolder: documentFolder}))
    // .add(new StoreDocs(setupRunner.getOutputFrom(0)))
    .add(new BreakdownDocs({fileList: fileList, documentFolder: documentFolder}))
    .add(new StoreDocs(setupRunner.getOutputFrom(1)))
  ;

const debug = false;
runner.run(debug).then(() => {
  setupRunner.run();
  console.log('Ok');
}).catch((err) => {
  console.log('db.deploy', err);
});

// const setupRunner = new SetupRunner();
