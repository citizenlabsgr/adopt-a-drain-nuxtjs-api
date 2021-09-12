'use strict';
/* eslint-disable no-undef */

const Consts = require('../lib/constants/consts');
const SqlRunner = require('../lib/runner/runner_sql.js');

const BaseTests = require('./tests/test_base.js');
const ApiTests = require('./tests/test_api.js');

// run all scripts
// Creates have an order
// Add new or alters to end
// Make new class for alters
// [* set the verson ]

const baseVersion='0_0_1';
const apiVersion='0_0_1';
// $lab:coverage:off$
// [* switch to heroku color url when available]
let DB_URL=process.env.DATABASE_URL;
const regex = new RegExp(Consts.databaseUrlPattern());
for (let env in process.env) {
  if (regex.test(env)) {
    console.log('setting ', env);
    DB_URL=process.env[env];
  }
}

// [* Build database]
// [* support multiple versions]
// [* Tests]
// if (testable) {

  new SqlRunner(DB_URL)
    .load(new BaseTests(baseVersion))
    .load(new ApiTests(apiVersion, baseVersion))
    .run();
// }

// $lab:coverage:on$



