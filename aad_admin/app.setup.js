
'use strict';
/*
Goal: Maintain a public Terms of Use Document

*/
// console.log('app.setup');
/* eslint-disable no-undef */

// console.log('A __filename', __filename);
// console.log('A __dirname', __dirname);
// const documentFolder = `${__dirname}/documents`;

const documentFolder = `${__dirname.replace('aad_admin','models')}/documents`;
const Runner = require('./lib/runner.js');
const DatabaseUrl = require('./lib/database_url.js');
const BreakdownDocs = require('./lib/breakdown_docs.js');
const StoreDocs = require('./lib/store_docs.js');

const Util = require('./lib/util.js');

const fileList = new Util().getFileList(documentFolder);

const databaseUrl = new DatabaseUrl(process);
const DB_URL = databaseUrl.db_url;

let runn =  new Runner(true)
                  .setConnectionString(DB_URL)
                  ;

runn
  .add(new BreakdownDocs({fileList: fileList, documentFolder: documentFolder}))
  .add(new StoreDocs(runn.getOutputFrom(0)))
  ;
runn.run();

// $lab:coverage:on$
